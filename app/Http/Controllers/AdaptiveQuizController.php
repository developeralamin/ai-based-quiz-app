<?php

namespace App\Http\Controllers;

use App\Models\AIQuiz;
use App\Models\QuizResult;
use App\Services\AdaptiveQuizService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AdaptiveQuizController extends Controller
{
    private AdaptiveQuizService $adaptiveQuizService;

    public function __construct(AdaptiveQuizService $adaptiveQuizService)
    {
        $this->adaptiveQuizService = $adaptiveQuizService;
    }

    /**
     * Start an adaptive quiz session
     */
    public function start(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'quiz_id' => 'required|integer|exists:a_i_quizzes,id',
            'starting_difficulty' => 'in:easy,medium,hard',
        ]);

        $quiz = AIQuiz::findOrFail($validated['quiz_id']);
        $this->authorize('view', $quiz);

        try {
            $session = $this->adaptiveQuizService->startAdaptiveSession(
                $quiz,
                $validated['starting_difficulty'] ?? 'medium'
            );

            $firstQuestion = $this->adaptiveQuizService->getNextQuestion($session);

            return response()->json([
                'success' => true,
                'session_id' => $session->id,
                'session' => $session,
                'first_question' => $firstQuestion,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get next question for adaptive quiz
     */
    public function getNextQuestion(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => 'required|integer|exists:adaptive_quiz_sessions,id',
        ]);

        $session = \App\Models\AdaptiveQuizSession::findOrFail($validated['session_id']);
        $this->authorize('view', $session->quiz);

        if (!$session->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Session is not active',
            ], 400);
        }

        $question = $this->adaptiveQuizService->getNextQuestion($session);

        if (!$question) {
            return response()->json([
                'success' => false,
                'message' => 'Quiz completed',
                'session' => $session,
            ]);
        }

        return response()->json([
            'success' => true,
            'question_number' => $session->current_question_index + 1,
            'question' => $question,
            'current_difficulty' => $session->current_difficulty,
        ]);
    }

    /**
     * Submit answer for adaptive quiz
     */
    public function submitAnswer(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => 'required|integer|exists:adaptive_quiz_sessions,id',
            'user_answer' => 'required|string',
        ]);

        $session = \App\Models\AdaptiveQuizSession::findOrFail($validated['session_id']);
        $this->authorize('view', $session->quiz);

        try {
            $question = $this->adaptiveQuizService->getNextQuestion($session);
            if (!$question) {
                return response()->json([
                    'success' => false,
                    'message' => 'No more questions',
                ], 400);
            }

            // Check answer
            $isCorrect = strtolower(trim($validated['user_answer'])) === 
                        strtolower(trim($question['answer']));

            // Process answer and update session
            $this->adaptiveQuizService->processAnswer($session, $isCorrect);

            // Get next question
            $nextQuestion = $this->adaptiveQuizService->getNextQuestion($session);
            $adjustment = $this->adaptiveQuizService->getDifficultyAdjustment($session);

            $response = [
                'success' => true,
                'is_correct' => $isCorrect,
                'correct_answer' => $question['answer'],
                'explanation' => $question['explanation'] ?? null,
                'current_difficulty' => $session->current_difficulty,
                'adjustment_info' => $adjustment,
                'session' => $session,
            ];

            if ($nextQuestion) {
                $response['next_question'] = $nextQuestion;
                $response['question_number'] = $session->current_question_index + 1;
            } else {
                $response['quiz_completed'] = true;
                $response['summary'] = $this->adaptiveQuizService->getSessionSummary($session);
            }

            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Complete adaptive quiz session
     */
    public function complete(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => 'required|integer|exists:adaptive_quiz_sessions,id',
        ]);

        $session = \App\Models\AdaptiveQuizSession::findOrFail($validated['session_id']);
        $this->authorize('view', $session->quiz);

        try {
            $this->adaptiveQuizService->completeSession($session);
            $summary = $this->adaptiveQuizService->getSessionSummary($session);

            return response()->json([
                'success' => true,
                'message' => 'Session completed',
                'summary' => $summary,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get session summary
     */
    public function getSummary(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => 'required|integer|exists:adaptive_quiz_sessions,id',
        ]);

        $session = \App\Models\AdaptiveQuizSession::findOrFail($validated['session_id']);
        $this->authorize('view', $session->quiz);

        $summary = $this->adaptiveQuizService->getSessionSummary($session);

        return response()->json([
            'success' => true,
            'summary' => $summary,
        ]);
    }
}
