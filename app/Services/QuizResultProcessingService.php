<?php

namespace App\Services;

use App\Models\QuizResult;
use App\Models\QuizSchedule;
use App\Models\UserReadingProgress;
use App\Models\UserPerformanceAnalytics;
use Illuminate\Support\Facades\Auth;

class QuizResultProcessingService
{
    private AnalyticsService $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Process and store quiz result
     */
    public function processQuizResult(
        int $quizId,
        array $userAnswers,
        array $quizQuestions,
        ?int $timeTakenSeconds = null,
        ?string $topic = null,
        ?int $chapter = null,
        ?string $difficultyAttempted = null
    ): QuizResult {
        // Calculate score
        $correctCount = 0;
        $totalCount = count($quizQuestions);
        $questionWiseAnalysis = [];

        foreach ($quizQuestions as $index => $question) {
            // Try to get answer by question_no first (frontend key), then by index
            $questionNo = $question['question_no'] ?? ($index + 1);

            // Try multiple ways to find the user answer (handle both int and string keys)
            $userAnswer = $userAnswers[$questionNo]
                ?? $userAnswers[(string)$questionNo]
                ?? $userAnswers[$index]
                ?? $userAnswers[(string)$index]
                ?? null;

            $isCorrect = $this->checkAnswer($userAnswer, $question['answer']);

            if ($isCorrect) {
                $correctCount++;
            }

            $questionWiseAnalysis[] = [
                'question_number' => $questionNo,
                'user_answer' => $userAnswer,
                'correct_answer' => $question['answer'],
                'is_correct' => $isCorrect,
                'type' => $question['type'] ?? 'multiple-choice',
            ];
        }

        $score = ($totalCount > 0) ? ($correctCount / $totalCount) * 100 : 0;

        // Store result
        $result = QuizResult::create([
            'user_id' => Auth::id(),
            'quiz_id' => $quizId,
            'user_answers' => $userAnswers,
            'quiz_questions' => $quizQuestions,
            'score' => $score,
            'correct_count' => $correctCount,
            'total_count' => $totalCount,
            'time_taken_seconds' => $timeTakenSeconds,
            'is_completed' => true,
            'started_at' => now()->subSeconds($timeTakenSeconds ?? 0),
            'completed_at' => now(),
            'topic' => $topic,
            'chapter' => $chapter,
            'difficulty_attempted' => $difficultyAttempted,
            'question_wise_analysis' => $questionWiseAnalysis,
        ]);

        // Update analytics
        $this->updateUserAnalytics($result, $topic, $difficultyAttempted);

        // Update question bank statistics
        $this->updateQuestionBankStats($quizQuestions, $userAnswers);

        // Update reading progress if associated with a book
        if ($result->quiz->book_id) {
            $this->updateReadingProgress($result);
        }

        // Check and update any scheduled quizzes
        $this->updateScheduledQuizzes($result);

        return $result;
    }

    /**
     * Check if user answer is correct
     */
    private function checkAnswer($userAnswer, $correctAnswer): bool
    {
        if (is_null($userAnswer) || is_null($correctAnswer)) {
            return false;
        }

        // Normalize answers for comparison
        $userAnswer = strtolower(trim($userAnswer));
        $correctAnswer = strtolower(trim($correctAnswer));

        // Check for exact match
        if ($userAnswer === $correctAnswer) {
            return true;
        }

        // For multiple choice, check option letter
        if (preg_match('/^[a-d]$/i', $userAnswer) && preg_match('/^[a-d]$/i', $correctAnswer)) {
            return strtoupper($userAnswer) === strtoupper($correctAnswer);
        }

        // For true/false
        if (in_array($userAnswer, ['true', 'false', 't', 'f', '1', '0'])) {
            return $this->normalizeBooleanAnswer($userAnswer) === $this->normalizeBooleanAnswer($correctAnswer);
        }

        return false;
    }

    /**
     * Normalize boolean answers
     */
    private function normalizeBooleanAnswer($answer): ?bool
    {
        $answer = strtolower(trim($answer));
        if (in_array($answer, ['true', 't', '1', 'yes'])) {
            return true;
        }
        if (in_array($answer, ['false', 'f', '0', 'no'])) {
            return false;
        }
        return null;
    }

    /**
     * Update user performance analytics
     */
    private function updateUserAnalytics(QuizResult $result, ?string $topic, ?string $difficulty): void
    {
        $userId = $result->user_id;
        $bookId = $result->quiz->book_id;

        // Update overall performance
        $overall = UserPerformanceAnalytics::firstOrCreate(
            [
                'user_id' => $userId,
                'book_id' => $bookId,
                'topic' => null,
                'difficulty_level' => null,
            ]
        );

        $overall->total_quizzes += 1;
        $overall->total_questions += $result->total_count;
        $overall->correct_answers += $result->correct_count;
        $overall->average_score = ($overall->correct_answers / $overall->total_questions) * 100;
        $overall->accuracy_percentage = $overall->average_score;
        $overall->total_time_minutes += intval(($result->time_taken_seconds ?? 0) / 60);
        $overall->last_quiz_date = now();
        $overall->save();

        // Update topic-specific performance
        if ($topic) {
            $topicAnalytics = UserPerformanceAnalytics::firstOrCreate(
                [
                    'user_id' => $userId,
                    'book_id' => $bookId,
                    'topic' => $topic,
                    'difficulty_level' => null,
                ]
            );

            $topicAnalytics->total_quizzes += 1;
            $topicAnalytics->total_questions += $result->total_count;
            $topicAnalytics->correct_answers += $result->correct_count;
            $topicAnalytics->average_score = ($topicAnalytics->correct_answers / $topicAnalytics->total_questions) * 100;
            $topicAnalytics->accuracy_percentage = $topicAnalytics->average_score;
            $topicAnalytics->total_time_minutes += intval(($result->time_taken_seconds ?? 0) / 60);
            $topicAnalytics->last_quiz_date = now();
            $topicAnalytics->save();
        }

        // Update difficulty-specific performance
        if ($difficulty) {
            $diffAnalytics = UserPerformanceAnalytics::firstOrCreate(
                [
                    'user_id' => $userId,
                    'book_id' => $bookId,
                    'topic' => null,
                    'difficulty_level' => $difficulty,
                ]
            );

            $diffAnalytics->total_quizzes += 1;
            $diffAnalytics->total_questions += $result->total_count;
            $diffAnalytics->correct_answers += $result->correct_count;
            $diffAnalytics->average_score = ($diffAnalytics->correct_answers / $diffAnalytics->total_questions) * 100;
            $diffAnalytics->accuracy_percentage = $diffAnalytics->average_score;
            $diffAnalytics->last_quiz_date = now();
            $diffAnalytics->save();
        }
    }

    /**
     * Update question bank statistics
     */
    private function updateQuestionBankStats(array $quizQuestions, array $userAnswers): void
    {
        // This would update success rates for each question in the bank
        // Implementation depends on how questions are stored
    }

    /**
     * Update reading progress
     */
    private function updateReadingProgress(QuizResult $result): void
    {
        $progress = UserReadingProgress::firstOrCreate(
            [
                'user_id' => $result->user_id,
                'book_id' => $result->quiz->book_id,
            ]
        );

        $progress->last_read_at = now();
        $progress->save();
    }

    /**
     * Update scheduled quizzes
     */
    private function updateScheduledQuizzes(QuizResult $result): void
    {
        $schedule = QuizSchedule::where('user_id', $result->user_id)
            ->where('quiz_id', $result->quiz_id)
            ->first();

        if ($schedule) {
            $schedule->markCompleted();
        }
    }

    /**
     * Get detailed performance summary
     */
    public function getDetailedSummary(QuizResult $result): array
    {
        $questionWiseAnalysis = $result->question_wise_analysis ?? [];
        $correctByType = [];
        $totalByType = [];

        foreach ($questionWiseAnalysis as $analysis) {
            $type = $analysis['type'];

            if (!isset($correctByType[$type])) {
                $correctByType[$type] = 0;
                $totalByType[$type] = 0;
            }

            $totalByType[$type]++;
            if ($analysis['is_correct']) {
                $correctByType[$type]++;
            }
        }

        return [
            'overall' => [
                'score' => round($result->score, 2),
                'correct_count' => $result->correct_count,
                'total_count' => $result->total_count,
                'accuracy_percentage' => round(($result->correct_count / $result->total_count) * 100, 2),
                'time_taken_minutes' => $result->getTimeTakenMinutes(),
                'performance_rating' => $result->getPerformanceRating(),
                'passed' => $result->isPassed(),
            ],
            'by_type' => array_map(function($type) use ($correctByType, $totalByType) {
                return [
                    'type' => $type,
                    'correct' => $correctByType[$type],
                    'total' => $totalByType[$type],
                    'accuracy' => round(($correctByType[$type] / $totalByType[$type]) * 100, 2),
                ];
            }, array_keys($totalByType)),
            'question_analysis' => $questionWiseAnalysis,
        ];
    }
}
