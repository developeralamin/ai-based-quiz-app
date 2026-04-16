<?php

namespace App\Services;

use App\Models\User;
use App\Models\Book;
use App\Models\QuizResult;
use App\Models\UserPerformanceAnalytics;
use App\Models\UserReadingProgress;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    /**
     * Get comprehensive performance dashboard for user
     */
    public function getUserDashboard(User $user): array
    {
        return [
            'overall_stats' => $this->getOverallStats($user),
            'recent_quizzes' => $this->getRecentQuizzes($user, 5),
            'top_topics' => $this->getTopTopics($user, 5),
            'weak_areas' => $this->getWeakAreas($user, 5),
            'learning_trends' => $this->getLearningTrends($user),
            'reading_progress' => $this->getReadingProgress($user),
            'recommendations' => $this->getRecommendations($user),
        ];
    }

    /**
     * Get overall statistics for user
     */
    public function getOverallStats(User $user): array
    {
        $quizzes = QuizResult::where('user_id', $user->id)->get();

        $totalQuizzes = $quizzes->count();
        $totalQuestions = $quizzes->sum('total_count');
        $correctAnswers = $quizzes->sum('correct_count');
        $averageScore = $totalQuizzes > 0 ? $quizzes->avg('score') : 0;
        $totalTimeMinutes = $quizzes->sum(function($quiz) {
            return $quiz->time_taken_seconds ? $quiz->time_taken_seconds / 60 : 0;
        });

        return [
            'total_quizzes' => $totalQuizzes,
            'total_questions' => $totalQuestions,
            'correct_answers' => $correctAnswers,
            'accuracy_percentage' => $totalQuestions > 0 ? ($correctAnswers / $totalQuestions) * 100 : 0,
            'average_score' => $averageScore,
            'total_study_time_minutes' => intval($totalTimeMinutes),
            'passing_quizzes' => $quizzes->where('score', '>=', 60)->count(),
            'performance_level' => $this->getPerformanceLevel($averageScore),
        ];
    }

    /**
     * Get recent quizzes for user
     */
    public function getRecentQuizzes(User $user, int $limit = 5): Collection
    {
        return QuizResult::where('user_id', $user->id)
            ->with(['quiz', 'user'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get performance by topic
     */
    public function getTopTopics(User $user, int $limit = 5): array
    {
        return UserPerformanceAnalytics::where('user_id', $user->id)
            ->whereNotNull('topic')
            ->orderBy('accuracy_percentage', 'desc')
            ->limit($limit)
            ->get()
            ->map(fn($stat) => [
                'topic' => $stat->topic,
                'accuracy' => $stat->accuracy_percentage,
                'total_quizzes' => $stat->total_quizzes,
                'average_score' => $stat->average_score,
            ])
            ->toArray();
    }

    /**
     * Get weak areas (low performance topics)
     */
    public function getWeakAreas(User $user, int $limit = 5): array
    {
        return UserPerformanceAnalytics::where('user_id', $user->id)
            ->whereNotNull('topic')
            ->where('total_quizzes', '>', 0)
            ->orderBy('accuracy_percentage', 'asc')
            ->limit($limit)
            ->get()
            ->map(fn($stat) => [
                'topic' => $stat->topic,
                'accuracy' => $stat->accuracy_percentage,
                'total_quizzes' => $stat->total_quizzes,
                'recommendation' => 'Focus on this topic',
            ])
            ->toArray();
    }

    /**
     * Get learning trends over time
     */
    public function getLearningTrends(User $user, int $days = 30): array
    {
        $startDate = now()->subDays($days);

        $trends = QuizResult::where('user_id', $user->id)
            ->where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, AVG(score) as average_score, COUNT(*) as quiz_count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return $trends->map(fn($trend) => [
            'date' => $trend->date,
            'average_score' => round($trend->average_score, 2),
            'quiz_count' => $trend->quiz_count,
        ])->toArray();
    }

    /**
     * Get reading progress across all books
     */
    public function getReadingProgress(User $user): array
    {
        $progress = UserReadingProgress::where('user_id', $user->id)
            ->with('book')
            ->get();

        return $progress->map(fn($p) => [
            'book_id' => $p->book_id,
            'book_title' => $p->book->title,
            'progress_percentage' => $p->progress_percentage,
            'chapters_read' => $p->chapters_read,
            'total_chapters' => $p->total_chapters,
            'total_reading_time_minutes' => $p->total_reading_time_minutes,
            'last_read_at' => $p->last_read_at,
        ])->toArray();
    }

    /**
     * Generate personalized recommendations
     */
    public function getRecommendations(User $user): array
    {
        $recommendations = [];
        $analytics = UserPerformanceAnalytics::where('user_id', $user->id)->get();

        // Recommend topics with low performance
        $weakTopics = $analytics
            ->where('accuracy_percentage', '<', 60)
            ->sortBy('accuracy_percentage')
            ->take(3);

        foreach ($weakTopics as $topic) {
            $recommendations[] = [
                'type' => 'practice',
                'message' => "Practice more on '{$topic->topic}' - Your accuracy is only {$topic->accuracy_percentage}%",
                'topic' => $topic->topic,
                'priority' => 'high',
            ];
        }

        // Recommend reading more chapters
        $incompleteBooks = UserReadingProgress::where('user_id', $user->id)
            ->where('progress_percentage', '<', 100)
            ->get();

        foreach ($incompleteBooks as $book) {
            $recommendations[] = [
                'type' => 'read',
                'message' => "Continue reading '{$book->book->title}' - {$book->progress_percentage}% complete",
                'book_id' => $book->book_id,
                'priority' => 'medium',
            ];
        }

        return array_slice($recommendations, 0, 5);
    }

    /**
     * Get performance metrics by difficulty level
     */
    public function getPerformanceByDifficulty(User $user): array
    {
        return UserPerformanceAnalytics::where('user_id', $user->id)
            ->whereNotNull('difficulty_level')
            ->groupBy('difficulty_level')
            ->get()
            ->map(fn($stat) => [
                'difficulty' => $stat->difficulty_level,
                'accuracy' => $stat->accuracy_percentage,
                'total_quizzes' => $stat->total_quizzes,
                'average_score' => $stat->average_score,
            ])
            ->toArray();
    }

    /**
     * Get performance by book
     */
    public function getPerformanceByBook(User $user): array
    {
        return UserPerformanceAnalytics::where('user_id', $user->id)
            ->whereNotNull('book_id')
            ->with('book')
            ->get()
            ->map(fn($stat) => [
                'book_id' => $stat->book_id,
                'book_title' => $stat->book->title,
                'accuracy' => $stat->accuracy_percentage,
                'total_quizzes' => $stat->total_quizzes,
                'average_score' => $stat->average_score,
            ])
            ->toArray();
    }

    /**
     * Get performance level description
     */
    private function getPerformanceLevel(float $averageScore): string
    {
        if ($averageScore >= 90) {
            return 'Outstanding';
        } elseif ($averageScore >= 75) {
            return 'Excellent';
        } elseif ($averageScore >= 60) {
            return 'Good';
        } elseif ($averageScore >= 50) {
            return 'Fair';
        } else {
            return 'Needs Improvement';
        }
    }

    /**
     * Calculate progress for a specific book
     */
    public function calculateBookProgress(User $user, Book $book): array
    {
        $progress = UserReadingProgress::where('user_id', $user->id)
            ->where('book_id', $book->id)
            ->first();

        $quizzes = QuizResult::whereHas('quiz', function($q) use ($book) {
            $q->where('book_id', $book->id);
        })->where('user_id', $user->id)->get();

        return [
            'reading_progress' => $progress ? $progress->progress_percentage : 0,
            'chapters_read' => $progress ? $progress->chapters_read : 0,
            'total_chapters' => $progress ? $progress->total_chapters : 0,
            'quiz_statistics' => [
                'total_quizzes' => $quizzes->count(),
                'average_score' => $quizzes->avg('score') ?? 0,
                'accuracy' => $quizzes->count() > 0 ? ($quizzes->sum('correct_count') / $quizzes->sum('total_count')) * 100 : 0,
            ],
        ];
    }
}
