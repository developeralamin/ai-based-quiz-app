<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AIQuiz;
use App\Models\QuizResult;
use App\Models\Book;
use App\Models\BookChapter;
use App\Services\AdvancedQuizGenerationService;
use App\Services\QuizResultProcessingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

class QuizController extends Controller
{
    private AdvancedQuizGenerationService $quizGenerationService;
    private QuizResultProcessingService $resultProcessingService;

    public function __construct(
        AdvancedQuizGenerationService $quizGenerationService,
        QuizResultProcessingService $resultProcessingService
    ) {
        $this->quizGenerationService = $quizGenerationService;
        $this->resultProcessingService = $resultProcessingService;
    }

    /**
     * Show quiz form
     */
    public function quizForm(): Response
    {
        return inertia('Quiz/Create');
    }

    /**
     * Generate quiz (backward compatible with old system)
     */
    public function generateQuiz(Request $request): Response
    {
        $text = $request->input('text');
        $numQuestions = $request->input('num_question');
        $language = $request->input('language');

        // Fetch API key from .env
        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            return Inertia::render('Quiz/Generate', ['error' => 'API key is missing']);
        }

        // Validate num_question
        if (!empty($numQuestions) && !is_numeric($numQuestions)) {
            return Inertia::render('Quiz/Generate', ['error' => 'Invalid number of questions']);
        }

        // Generate the prompt
        $promptPrefix = !empty($numQuestions) ? "Generate exactly $numQuestions " : "Generate a quiz with ";
        $languageInstruction = !empty($language)? "All questions and answers must be written in $language language.\n": "";
        $prompt = $promptPrefix . "
        multiple-choice and true/false questions
        based on the following text:\n\n$text\n\n" .

        $languageInstruction .
         "
        Respond only with a valid JSON array in the following format:
        [
            {\"type\": \"multiple-choice\", \"question\": \"What is the capital of France?\", \"options\": [\"A) Madrid\", \"B) Berlin\", \"C) Paris\", \"D) Rome\"], \"answer\": \"C\"},
            {\"type\": \"true-false\", \"question\": \"The sun rises in the west.\", \"answer\": \"False\"}
        ]
        Do not include any extra text outside the JSON array.
        Do not generate fill-in-gaps, short-answer, or long-answer questions.\";";

        $response = Http::withHeaders(['Content-Type' => 'application/json'])
            ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=$apiKey", [
                "contents" => [["parts" => [["text" => $prompt]]]]
            ]);

        if($response->failed()) {
            return Inertia::render('Quiz/Generate', ['error' => 'Gemini API request failed', 'details' => $response->json()]);
        }

        // Extract and process API response
        $quizJson = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? '';
        preg_match('/\[[\s\S]*\]/', $quizJson, $matches);
        $cleanJson = $matches[0] ?? '';
        $quizArray = json_decode($cleanJson, true);

        if (!is_array($quizArray)) {
            return Inertia::render('Quiz/Generate', ['error' => 'Invalid JSON format returned from Gemini API', 'raw_response' => $quizJson]);
        }

        // Truncate and number questions
        if (!empty($numQuestions) && count($quizArray) > $numQuestions) {
            $quizArray = array_slice($quizArray, 0, $numQuestions);
        }

        foreach ($quizArray as $index => &$question) {
            $question['question_no'] = $index + 1;
        }
        //store the quiz in the database
        $quizId = null;
        if($quizJson){
            $quiz = AIQuiz::create([
                'user_id' => auth()->id(),
                'title' =>  $text,
                'full_response' => $quizArray,
                'status' => $quizJson ? 1 : 0,
                'language' => $language ?? 'en',
            ]);
            $quizId = $quiz->id;
        }

        return Inertia::render('Quiz/Generate', ['quiz' => $quizArray, 'quizId' => $quizId]);
    }

    /**
     * Generate advanced quiz
     */
    public function generateAdvancedQuiz(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'content' => 'nullable|string|min:50',
            'num_questions' => 'required|integer|min:1|max:50',
            'difficulty' => 'required|in:easy,medium,hard',
            'question_type' => 'in:mcq,true-false,short-answer,mixed',
            'book_id' => 'nullable|integer|exists:books,id',
            'chapter_id' => 'nullable|integer|exists:book_chapters,id',
            'topic' => 'nullable|string|max:255',
            'language' => 'nullable|string|max:10',
            'save_to_bank' => 'boolean',
        ]);

        try {
            // If chapter_id is provided, fetch the chapter content
            $content = $validated['content'];
            $chapterId = $validated['chapter_id'] ?? null;
            $bookId = $validated['book_id'] ?? null;
            $topic = $validated['topic'] ?? null;

            if ($chapterId) {
                $chapter = BookChapter::findOrFail($chapterId);
                $content = $chapter->content;
                $bookId = $chapter->book_id;
                $topic = $chapter->title;
            }

            // Content is required
            if (!$content || strlen(trim($content)) < 50) {
                return response()->json([
                    'success' => false,
                    'error' => 'Content must be at least 50 characters long'
                ], 422);
            }

            $result = $this->quizGenerationService->generateAdvancedQuiz(
                content: $content,
                numQuestions: $validated['num_questions'],
                difficulty: $validated['difficulty'],
                questionType: $validated['question_type'] ?? 'mixed',
                language: $validated['language'] ?? 'en',
                bookId: $bookId,
                chapterId: $chapterId,
                topic: $topic,
                saveToBank: $validated['save_to_bank'] ?? true
            );

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Generate quiz from book chapter
     */
    public function generateFromChapter(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'chapter_id' => 'required|integer|exists:book_chapters,id',
            'num_questions' => 'required|integer|min:1|max:50',
            'difficulty' => 'required|in:easy,medium,hard',
        ]);

        try {
            $chapter = BookChapter::findOrFail($validated['chapter_id']);

            $result = $this->quizGenerationService->generateQuizFromChapter(
                chapter: $chapter,
                numQuestions: $validated['num_questions'],
                difficulty: $validated['difficulty']
            );

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Store the quiz result
     */
    public function submitQuizResult(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'quiz_id' => 'required|integer|exists:a_i_quizzes,id',
                'user_answers' => 'required|array',
                'quiz_questions' => 'required|array',
                'score' => 'required|numeric|min:0|max:100',
                'correct_count' => 'required|integer|min:0',
                'total_count' => 'required|integer|min:1',
                'time_taken_seconds' => 'nullable|integer|min:0',
                'topic' => 'nullable|string',
                'chapter' => 'nullable|integer',
                'difficulty_attempted' => 'nullable|in:easy,medium,hard',
            ]);

            // Verify the quiz belongs to the authenticated user
            $quiz = AIQuiz::where('id', $validated['quiz_id'])
                ->where('user_id', auth()->id())
                ->firstOrFail();

            // Process the result
            $result = $this->resultProcessingService->processQuizResult(
                quizId: $validated['quiz_id'],
                userAnswers: $validated['user_answers'],
                quizQuestions: $validated['quiz_questions'],
                timeTakenSeconds: $validated['time_taken_seconds'] ?? null,
                topic: $validated['topic'] ?? null,
                chapter: $validated['chapter'] ?? null,
                difficultyAttempted: $validated['difficulty_attempted'] ?? null
            );

            $summary = $this->resultProcessingService->getDetailedSummary($result);

            return response()->json([
                'success' => true,
                'result_id' => $result->id,
                'summary' => $summary,
                'message' => 'Quiz result saved successfully'
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Quiz not found or unauthorized'
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Quiz submission error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to save quiz result: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get quiz details with explanations
     */
    public function show(AIQuiz $quiz): Response
    {
        $this->authorize('view', $quiz);

        return Inertia::render('Quiz/Generate', [
            'quiz' => $quiz->full_response,
            'quizId' => $quiz->id,
            'quizData' => $quiz->load('explanations'),
        ]);
    }

    /**
     * Get quiz result details
     */
    public function getResult(QuizResult $result): JsonResponse
    {
        $this->authorize('view', $result);

        $summary = $this->resultProcessingService->getDetailedSummary($result);

        return response()->json([
            'result' => $result->load('quiz'),
            'summary' => $summary,
        ]);
    }
}
