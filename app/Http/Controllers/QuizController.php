<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AIQuiz;
use App\Models\QuizAttempt;
use App\Models\QuizAnswer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class QuizController extends Controller
{
    /**
     * Summary of quizForm
     * @return Response|\Inertia\ResponseFactory
     */
    public function quizForm()
    {
        return inertia('Quiz/Create');
    }

    /**
     * Summary of generateQuiz
     * @param \Illuminate\Http\Request $request
     * @return Response
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
        multiple-choice (with A, B, C, D options) and true/false questions
        based on the following text:\n\n$text\n\n" .

        $languageInstruction .
         "
        Respond only with a valid JSON array in the following format:
        [
            {\"type\": \"multiple-choice\", \"question\": \"What is the capital of France?\", \"options\": [\"A) Madrid\", \"B) Berlin\", \"C) Paris\", \"D) Rome\"], \"answer\": \"C\"},
            {\"type\": \"true-false\", \"question\": \"The sun rises in the west.\", \"answer\": \"False\"}
        ]
        Mix multiple-choice and true/false questions evenly. Do not include any extra text outside the JSON array.";
        //Old model
        // $response = Http::withHeaders(['Content-Type' => 'application/json'])
        //     ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$apiKey", [
        //         "contents" => [["parts" => [["text" => $prompt]]]]
        //     ]);
        //new model
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

        //store the full response in the database
        $quiz = null;
        if($quizJson){
            $quiz = AIQuiz::create([
                'user_id' => auth()->id(),
                'title' =>  $text,
                'full_response' => $response->json(),
                'status' => $quizJson ? 1 : 0,
                'language' => $language ?? 'en',
            ]);
        }

        return Inertia::render('Quiz/Generate', [
            'quiz' => $quizArray,
            'quiz_id' => $quiz?->id,
        ]);
    }

    /**
     * Submit quiz answers and evaluate them
     * @param \Illuminate\Http\Request $request
     * @return JsonResponse
     */
    public function submitAnswers(Request $request): JsonResponse
    {
        try {
            $aIQuizId = $request->input('quiz_id');
            $userAnswers = $request->input('answers', []);
            $quizData = $request->input('quiz_data', []);

            \Log::info('Quiz Submission', [
                'quiz_id' => $aIQuizId,
                'user_id' => auth()->id(),
                'quiz_data_count' => count($quizData),
                'answers_count' => count($userAnswers),
                'quiz_data' => $quizData,
                'user_answers' => $userAnswers,
            ]);

            if (!$aIQuizId || empty($quizData)) {
                return response()->json(['error' => 'Missing required data'], 400);
            }

            $quiz = AIQuiz::findOrFail($aIQuizId);
            $userId = auth()->id();

            // Create a new quiz attempt
            $attempt = new QuizAttempt();
            $attempt->user_id = $userId;
            $attempt->a_i_quiz_id = $aIQuizId;
            $attempt->quiz_data = $quizData;
            $attempt->total_questions = count($quizData);
            $attempt->status = 'completed';
            $attempt->started_at = now();
            $attempt->completed_at = now();

            $correctCount = 0;
            $wrongCount = 0;
            $allAnswers = [];

            // Evaluate each answer
            foreach ($quizData as $question) {
                $questionNo = $question['question_no'];
                $userAnswer = isset($userAnswers[$questionNo]) ? $userAnswers[$questionNo] : '';
                $correctAnswer = isset($question['answer']) ? $question['answer'] : '';
                $isCorrect = $this->normalizeAndCompare($userAnswer, $correctAnswer, $question['type']);

                if ($isCorrect) {
                    $correctCount++;
                } else {
                    $wrongCount++;
                }

                $allAnswers[] = [
                    'question_no' => $questionNo,
                    'question_type' => $question['type'],
                    'question_text' => $question['question'],
                    'user_answer' => $userAnswer,
                    'correct_answer' => $correctAnswer,
                    'is_correct' => $isCorrect,
                ];
            }

            // Calculate score
            $scorePercentage = ($correctCount / $attempt->total_questions) * 100;
            $attempt->correct_answers = $correctCount;
            $attempt->wrong_answers = $wrongCount;
            $attempt->score = $scorePercentage;
            $attempt->save();

            // Save individual answers
            foreach ($allAnswers as $answer) {
                QuizAnswer::create([
                    'quiz_attempt_id' => $attempt->id,
                    'question_no' => $answer['question_no'],
                    'question_type' => $answer['question_type'],
                    'question_text' => $answer['question_text'],
                    'user_answer' => $answer['user_answer'],
                    'correct_answer' => $answer['correct_answer'],
                    'is_correct' => $answer['is_correct'],
                ]);
            }

            \Log::info('Quiz Saved', [
                'attempt_id' => $attempt->id,
                'total_answers_saved' => count($allAnswers),
                'correct' => $correctCount,
                'wrong' => $wrongCount,
            ]);

            return response()->json([
                'success' => true,
                'quiz_attempt_id' => $attempt->id,
                'score' => round($scorePercentage, 2),
                'correct_answers' => $correctCount,
                'wrong_answers' => $wrongCount,
                'total_questions' => $attempt->total_questions,
                'performance_status' => $attempt->getPerformanceStatus(),
                'message' => 'Quiz submitted successfully!',
                'debug' => [
                    'answers_saved' => count($allAnswers),
                    'quiz_data_received' => count($quizData),
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Quiz Submission Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Failed to submit quiz: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Normalize and compare answers
     * @param string $userAnswer
     * @param string $correctAnswer
     * @param string $type
     * @return bool
     */
    private function normalizeAndCompare(string $userAnswer, string $correctAnswer, string $type): bool
    {
        $userAnswer = trim($userAnswer);
        $correctAnswer = trim($correctAnswer);

        // Handle multiple-choice answers (A, B, C, D)
        if ($type === 'multiple-choice') {
            // Extract just the letter from the answer
            $userLetter = strtoupper(preg_replace('/[^A-Z]/', '', $userAnswer));
            $correctLetter = strtoupper(preg_replace('/[^A-Z]/', '', $correctAnswer));

            return !empty($userLetter) && !empty($correctLetter) && $userLetter === $correctLetter;
        }

        // Handle true/false (case insensitive)
        if ($type === 'true-false') {
            $userNorm = strtolower($userAnswer);
            $correctNorm = strtolower($correctAnswer);

            // Normalize boolean-like values
            $userBool = in_array($userNorm, ['true', 't', '1', 'yes', 'y']) ? true : false;
            $correctBool = in_array($correctNorm, ['true', 't', '1', 'yes', 'y']) ? true : false;

            return $userBool === $correctBool;
        }

        // Default to false for unknown types
        return false;
    }

    /**
     * Get quiz attempt details
     * @param int $attemptId
     * @return JsonResponse
     */
    public function getAttemptDetails(int $attemptId): JsonResponse
    {
        try {
            $attempt = QuizAttempt::with('answers')
                ->where('user_id', auth()->id())
                ->findOrFail($attemptId);

            return response()->json([
                'success' => true,
                'attempt' => [
                    'id' => $attempt->id,
                    'score' => $attempt->score,
                    'correct_answers' => $attempt->correct_answers,
                    'wrong_answers' => $attempt->wrong_answers,
                    'total_questions' => $attempt->total_questions,
                    'performance_status' => $attempt->getPerformanceStatus(),
                    'completed_at' => $attempt->completed_at,
                    'answers' => $attempt->answers->map(fn($answer) => [
                        'question_no' => $answer->question_no,
                        'question_type' => $answer->question_type,
                        'question_text' => $answer->question_text,
                        'user_answer' => $answer->user_answer,
                        'correct_answer' => $answer->correct_answer,
                        'is_correct' => $answer->is_correct,
                    ]),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve attempt details'], 500);
        }
    }

    /**
     * Get quiz history for the current user
     * @return JsonResponse
     */
    public function getHistory(): JsonResponse
    {
        try {
            $history = QuizAttempt::where('user_id', auth()->id())
                ->with('quiz')
                ->where('status', 'completed')
                ->orderBy('completed_at', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $history->items(),
                'pagination' => [
                    'current_page' => $history->currentPage(),
                    'last_page' => $history->lastPage(),
                    'per_page' => $history->perPage(),
                    'total' => $history->total(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch history'], 500);
        }
    }

    /**
     * Get dashboard statistics
     * @return JsonResponse
     */
    public function getDashboardStats(): JsonResponse
    {
        try {
            $user = auth()->user();
            $stats = $user->getQuizStats();

            // Get recent activity
            $recentAttempts = QuizAttempt::where('user_id', auth()->id())
                ->where('status', 'completed')
                ->with('quiz')
                ->orderBy('completed_at', 'desc')
                ->take(5)
                ->get();

            // Get attempts by week for chart
            $weeklyData = QuizAttempt::where('user_id', auth()->id())
                ->where('status', 'completed')
                ->where('completed_at', '>=', now()->subDays(30))
                ->selectRaw('DATE(completed_at) as date, COUNT(*) as attempts, AVG(score) as avg_score')
                ->groupByRaw('DATE(completed_at)')
                ->orderBy('date', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'stats' => $stats,
                'recent_attempts' => $recentAttempts->map(fn($attempt) => [
                    'id' => $attempt->id,
                    'quiz_id' => $attempt->a_i_quiz_id,
                    'quiz_title' => $attempt->quiz->title ?? 'Untitled Quiz',
                    'score' => $attempt->score,
                    'correct_answers' => $attempt->correct_answers,
                    'wrong_answers' => $attempt->wrong_answers,
                    'completed_at' => $attempt->completed_at,
                    'performance_status' => $attempt->getPerformanceStatus(),
                ]),
                'weekly_data' => $weeklyData,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch dashboard stats'], 500);
        }
    }

    /**
     * Get list of quizzes with attempt status
     * @return JsonResponse
     */
    public function getQuizList(): JsonResponse
    {
        try {
            $userId = auth()->id();

            $quizzes = AIQuiz::where('user_id', $userId)
                ->with([
                    'attempts' => function ($query) use ($userId) {
                        $query->where('user_id', $userId)
                            ->where('status', 'completed')
                            ->orderBy('completed_at', 'desc');
                    }
                ])
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $quizzes->items(),
                'pagination' => [
                    'current_page' => $quizzes->currentPage(),
                    'last_page' => $quizzes->lastPage(),
                    'per_page' => $quizzes->perPage(),
                    'total' => $quizzes->total(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch quizzes'], 500);
        }
    }
}
