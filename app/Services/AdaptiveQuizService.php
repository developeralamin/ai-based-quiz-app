<?php

namespace App\Services;

use App\Models\AdaptiveQuizSession;
use App\Models\AIQuiz;
use Illuminate\Support\Facades\Auth;

class AdaptiveQuizService
{
    /**
     * Start an adaptive quiz session
     */
    public function startAdaptiveSession(AIQuiz $quiz, string $startingDifficulty = 'medium'): AdaptiveQuizSession
    {
        $session = AdaptiveQuizSession::create([
            'user_id' => Auth::id(),
            'quiz_id' => $quiz->id,
            'current_difficulty' => $startingDifficulty,
            'is_active' => true,
            'started_at' => now(),
        ]);

        return $session;
    }

    /**
     * Get next question based on adaptive logic
     */
    public function getNextQuestion(AdaptiveQuizSession $session): ?array
    {
        $questions = $session->quiz->full_response;

        if (!is_array($questions)) {
            return null;
        }

        $nextIndex = $session->current_question_index;

        if ($nextIndex >= count($questions)) {
            return null;
        }

        return $questions[$nextIndex] ?? null;
    }

    /**
     * Process user answer and update session
     */
    public function processAnswer(AdaptiveQuizSession $session, bool $isCorrect): void
    {
        $session->evaluateAnswer($isCorrect);
        $session->current_question_index += 1;
        $session->save();
    }

    /**
     * Complete adaptive session
     */
    public function completeSession(AdaptiveQuizSession $session): void
    {
        $session->is_active = false;
        $session->completed_at = now();
        $session->save();
    }

    /**
     * Get session summary
     */
    public function getSessionSummary(AdaptiveQuizSession $session): array
    {
        $trend = $session->performance_trend ?? [];
        $correctAnswers = collect($trend)->filter(fn($item) => $item['answer'])->count();

        return [
            'total_questions' => $session->current_question_index,
            'correct_answers' => $correctAnswers,
            'accuracy' => $session->current_question_index > 0
                ? ($correctAnswers / $session->current_question_index) * 100
                : 0,
            'final_difficulty' => $session->current_difficulty,
            'started_at' => $session->started_at,
            'completed_at' => $session->completed_at,
            'difficulty_progression' => $session->difficulty_history,
        ];
    }

    /**
     * Get difficulty adjustment suggestions
     */
    public function getDifficultyAdjustment(AdaptiveQuizSession $session): array
    {
        $recentAnswers = array_slice($session->performance_trend ?? [], -5);
        $correctInRecent = collect($recentAnswers)->filter(fn($item) => $item['answer'])->count();
        $recentAccuracy = count($recentAnswers) > 0 ? ($correctInRecent / count($recentAnswers)) * 100 : 0;

        return [
            'recent_accuracy' => $recentAccuracy,
            'should_increase' => $recentAccuracy >= 80,
            'should_decrease' => $recentAccuracy <= 40,
            'current_difficulty' => $session->current_difficulty,
            'suggestion' => $this->generateDifficultySuggestion($recentAccuracy),
        ];
    }

    /**
     * Generate difficulty suggestion message
     */
    private function generateDifficultySuggestion(float $accuracy): string
    {
        if ($accuracy >= 80) {
            return "Great job! Next difficulty level unlocked.";
        } elseif ($accuracy <= 40) {
            return "Let's try an easier level to build confidence.";
        } else {
            return "Steady progress! Keep practicing at this level.";
        }
    }

    /**
     * Generate adaptive quiz with selected difficulty questions
     */
    public function generateAdaptiveQuestionSet(AIQuiz $quiz, string $difficulty): array
    {
        $questions = $quiz->full_response;

        if (!is_array($questions)) {
            return [];
        }

        // Filter questions by difficulty (if stored)
        $filtered = array_filter($questions, function($q) use ($difficulty) {
            // This assumes difficulty is stored in question data
            // Otherwise, we filter by position or other heuristics
            return true; // Default: use all questions
        });

        return array_slice($filtered, 0, 10); // Return max 10 questions
    }
}
