<?php

namespace App\Services;

use App\Models\AIQuiz;
use App\Models\QuestionBank;
use App\Models\BookChapter;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class AdvancedQuizGenerationService
{
    private ?string $geminiApiKey;

    public function __construct()
    {
        $this->geminiApiKey = env('GEMINI_API_KEY');
    }

    /**
     * Generate quiz with advanced options
     */
    public function generateAdvancedQuiz(
        string $content,
        int $numQuestions,
        string $difficulty = 'medium',
        string $questionType = 'mixed',
        string $language = 'en',
        ?int $bookId = null,
        ?int $chapterId = null,
        ?string $topic = null,
        bool $saveToBank = true
    ): array {
        try {
            if (!$this->geminiApiKey) {
                Log::error("Gemini API key is not configured");
                return ['success' => false, 'error' => 'API key is missing. Please configure GEMINI_API_KEY in your .env file'];
            }

            $prompt = $this->buildAdvancedPrompt(
                $content,
                $numQuestions,
                $difficulty,
                $questionType,
                $language
            );

            $response = Http::withHeaders(['Content-Type' => 'application/json'])
                ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=$this->geminiApiKey", [
                    "contents" => [["parts" => [["text" => $prompt]]]]
                ]);

            if ($response->failed()) {
                Log::error("Gemini API request failed", ['response' => $response->json()]);
                return ['success' => false, 'error' => 'Failed to generate quiz'];
            }

            $quizJson = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? '';
            preg_match('/\[[\s\S]*\]/', $quizJson, $matches);
            $cleanJson = $matches[0] ?? '';
            $quizArray = json_decode($cleanJson, true);

            if (!is_array($quizArray)) {
                return ['success' => false, 'error' => 'Invalid response format'];
            }

            // Number the questions
            foreach ($quizArray as $index => &$question) {
                $question['question_no'] = $index + 1;
            }

            // Generate smart title based on content
            $smartTitle = $this->generateSmartTitle($content, $topic, $language);

            // Store quiz
            $quiz = AIQuiz::create([
                'user_id' => Auth::id(),
                'book_id' => $bookId,
                'chapter' => $chapterId,
                'topic' => $topic,
                'title' => $smartTitle,
                'full_response' => $quizArray,
                'difficulty_level' => $difficulty,
                'quiz_type' => 'practice',
                'language' => $language,
                'shuffle_questions' => true,
                'show_explanations' => true,
            ]);

            // Save questions to bank if enabled
            if ($saveToBank) {
                $this->saveQuestionsToBank($quizArray, $bookId, $chapterId, $topic, $difficulty);
            }

            // Generate explanations
            $this->generateExplanations($quiz, $quizArray);

            return [
                'success' => true,
                'quiz_id' => $quiz->id,
                'questions' => $quizArray,
                'metadata' => [
                    'difficulty' => $difficulty,
                    'question_count' => count($quizArray),
                    'type' => $questionType,
                ]
            ];
        } catch (\Exception $e) {
            Log::error("Error generating advanced quiz: " . $e->getMessage());
            return ['success' => false, 'error' => 'Error generating quiz'];
        }
    }

    /**
     * Generate a smart, user-friendly title based on content
     */
    private function generateSmartTitle(
        string $content,
        ?string $topic,
        string $language = 'en'
    ): string {
        // If topic is provided, use it as base
        if ($topic) {
            return $topic;
        }

        try {
            // Use first 500 characters to avoid token limits
            $contentSummary = substr($content, 0, 500);

            $languageInstruction = $language !== 'en'
                ? "Respond in $language language only.\n"
                : "";

            $prompt = "Extract the main topic/subject from this text and create a brief, user-friendly quiz title (max 8 words).\n\n" .
                $languageInstruction .
                "Text: $contentSummary\n\n" .
                "Respond with ONLY the title, nothing else. No quotes, no explanations.";

            $response = Http::withHeaders(['Content-Type' => 'application/json'])
                ->timeout(10)
                ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=$this->geminiApiKey", [
                    "contents" => [["parts" => [["text" => $prompt]]]]
                ]);

            if ($response->successful()) {
                $title = trim($response->json()['candidates'][0]['content']['parts'][0]['text'] ?? 'Quiz');
                // Clean up any quotes or special characters
                $title = str_replace(['"', "'", "\n"], '', $title);
                $title = trim($title);
                return !empty($title) && strlen($title) < 100 ? $title : 'Quiz';
            }
        } catch (\Exception $e) {
            Log::warning("Failed to generate smart title: " . $e->getMessage());
        }

        // Fallback to generic title
        return 'Quiz';
    }

    /**
     * Build advanced prompt for Gemini API
     */
    private function buildAdvancedPrompt(
        string $content,
        int $numQuestions,
        string $difficulty,
        string $questionType,
        string $language
    ): string {
        $questionTypeInstructions = match ($questionType) {
            'mcq' => 'Generate only multiple-choice questions with 4 options each.',
            'true-false' => 'Generate only true/false questions.',
            'short-answer' => 'Generate only short-answer questions requiring 1-3 sentences.',
            default => 'Generate a mix of multiple-choice (4 options), true/false, and short-answer questions.',
        };

        $difficultyInstruction = match ($difficulty) {
            'easy' => 'Focus on basic concepts and direct facts from the text.',
            'medium' => 'Include both direct facts and some inferential understanding.',
            'hard' => 'Focus on deep understanding, application, and critical thinking.',
            default => 'Balance between easy and challenging questions.',
        };

        $languageInstruction = !empty($language) && $language !== 'en'
            ? "All questions and answers must be written in $language language.\n"
            : "";

        return "Generate exactly $numQuestions quiz questions based on the following text:\n\n$content\n\n" .
            $questionTypeInstructions . "\n" .
            $difficultyInstruction . "\n" .
            $languageInstruction .
            "
Respond only with a valid JSON array in the following format:
[
    {
        \"type\": \"multiple-choice\",
        \"question\": \"Question text?\",
        \"options\": [\"A) Option 1\", \"B) Option 2\", \"C) Option 3\", \"D) Option 4\"],
        \"answer\": \"C\",
        \"explanation\": \"Brief explanation of why this is correct\"
    },
    {
        \"type\": \"true-false\",
        \"question\": \"Statement?\",
        \"answer\": \"True\",
        \"explanation\": \"Brief explanation\"
    },
    {
        \"type\": \"short-answer\",
        \"question\": \"What is...?\",
        \"answer\": \"Expected answer\",
        \"explanation\": \"Additional context\"
    }
]

Do not include any extra text outside the JSON array.";
    }

    /**
     * Save questions to question bank
     */
    private function saveQuestionsToBank(
        array $questions,
        ?int $bookId,
        ?int $chapterId,
        ?string $topic,
        string $difficulty
    ): void {
        foreach ($questions as $question) {
            $options = $question['options'] ?? null;
            $explanation = $question['explanation'] ?? null;

            QuestionBank::create([
                'user_id' => Auth::id(),
                'book_id' => $bookId,
                'chapter_id' => $chapterId,
                'question_type' => $question['type'],
                'topic' => $topic,
                'difficulty_level' => $difficulty,
                'question_text' => $question['question'],
                'options' => is_array($options) ? $options : null,
                'correct_answer' => $question['answer'],
                'explanation' => $explanation,
            ]);
        }
    }

    /**
     * Generate explanations for quiz questions
     */
    private function generateExplanations(AIQuiz $quiz, array $questions): void
    {
        foreach ($questions as $index => $question) {
            $quiz->explanations()->create([
                'question_number' => $index + 1,
                'question_text' => $question['question'],
                'correct_answer' => $question['answer'],
                'explanation' => $question['explanation'] ?? 'See above for the answer.',
                'additional_notes' => null,
            ]);
        }
    }

    /**
     * Generate quiz from chapter content
     */
    public function generateQuizFromChapter(BookChapter $chapter, int $numQuestions, string $difficulty = 'medium'): array
    {
        return $this->generateAdvancedQuiz(
            content: $chapter->content,
            numQuestions: $numQuestions,
            difficulty: $difficulty,
            questionType: 'mixed',
            bookId: $chapter->book_id,
            chapterId: $chapter->id,
            topic: $chapter->title,
            saveToBank: true
        );
    }

    /**
     * Generate quiz from specific pages/sections
     */
    public function generateQuizFromSection(
        string $content,
        string $sectionTitle,
        int $numQuestions,
        string $difficulty = 'medium',
        ?int $bookId = null
    ): array {
        return $this->generateAdvancedQuiz(
            content: $content,
            numQuestions: $numQuestions,
            difficulty: $difficulty,
            questionType: 'mixed',
            topic: $sectionTitle,
            bookId: $bookId,
            saveToBank: true
        );
    }
}
