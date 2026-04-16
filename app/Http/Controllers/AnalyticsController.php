<?php

namespace App\Http\Controllers;

use App\Services\AnalyticsService;
use App\Models\User;
use App\Models\QuizResult;
use App\Models\UserPerformanceAnalytics;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnalyticsController extends Controller
{
    private AnalyticsService $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Get user dashboard with comprehensive analytics
     */
    public function dashboard(): JsonResponse
    {
        $user = Auth::user();
        $dashboard = $this->analyticsService->getUserDashboard($user);

        return response()->json([
            'success' => true,
            'data' => $dashboard,
        ], 200, [
            'Content-Type' => 'application/json',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
        ]);
    }

    /**
     * Get overall statistics
     */
    public function overallStats(): JsonResponse
    {
        $user = Auth::user();
        $stats = $this->analyticsService->getOverallStats($user);

        return response()->json([
            'success' => true,
            'stats' => $stats,
        ]);
    }

    /**
     * Get recent quizzes
     */
    public function recentQuizzes(Request $request): JsonResponse
    {
        $limit = $request->input('limit', 10);
        $user = Auth::user();
        $quizzes = $this->analyticsService->getRecentQuizzes($user, $limit);

        return response()->json([
            'success' => true,
            'quizzes' => $quizzes,
        ]);
    }

    /**
     * Get performance by topic
     */
    public function topicPerformance(Request $request): JsonResponse
    {
        $limit = $request->input('limit', 10);
        $user = Auth::user();
        $topics = $this->analyticsService->getTopTopics($user, $limit);

        return response()->json([
            'success' => true,
            'topics' => $topics,
        ]);
    }

    /**
     * Get weak areas
     */
    public function weakAreas(Request $request): JsonResponse
    {
        $limit = $request->input('limit', 10);
        $user = Auth::user();
        $areas = $this->analyticsService->getWeakAreas($user, $limit);

        return response()->json([
            'success' => true,
            'weak_areas' => $areas,
        ]);
    }

    /**
     * Get learning trends
     */
    public function learningTrends(Request $request): JsonResponse
    {
        $days = $request->input('days', 30);
        $user = Auth::user();
        $trends = $this->analyticsService->getLearningTrends($user, $days);

        return response()->json([
            'success' => true,
            'trends' => $trends,
            'period_days' => $days,
        ]);
    }

    /**
     * Get reading progress
     */
    public function readingProgress(): JsonResponse
    {
        $user = Auth::user();
        $progress = $this->analyticsService->getReadingProgress($user);

        return response()->json([
            'success' => true,
            'reading_progress' => $progress,
        ]);
    }

    /**
     * Get recommendations
     */
    public function recommendations(): JsonResponse
    {
        $user = Auth::user();
        $recommendations = $this->analyticsService->getRecommendations($user);

        return response()->json([
            'success' => true,
            'recommendations' => $recommendations,
        ]);
    }

    /**
     * Get performance by difficulty
     */
    public function difficultyPerformance(): JsonResponse
    {
        $user = Auth::user();
        $performance = $this->analyticsService->getPerformanceByDifficulty($user);

        return response()->json([
            'success' => true,
            'by_difficulty' => $performance,
        ]);
    }

    /**
     * Get performance by book
     */
    public function bookPerformance(): JsonResponse
    {
        $user = Auth::user();
        $performance = $this->analyticsService->getPerformanceByBook($user);

        return response()->json([
            'success' => true,
            'by_book' => $performance,
        ]);
    }

    /**
     * Get detailed quiz result analysis
     */
    public function quizAnalysis(QuizResult $result): JsonResponse
    {
        $this->authorize('view', $result);

        $analysis = [
            'quiz' => $result->load('quiz'),
            'score' => $result->score,
            'correct_count' => $result->correct_count,
            'total_count' => $result->total_count,
            'time_taken' => $result->getTimeTakenMinutes(),
            'performance_rating' => $result->getPerformanceRating(),
            'passed' => $result->isPassed(),
            'question_analysis' => $result->question_wise_analysis ?? [],
        ];

        return response()->json([
            'success' => true,
            'analysis' => $analysis,
        ]);
    }

    /**
     * Export analytics data
     */
    public function export(Request $request): JsonResponse
    {
        $user = Auth::user();
        $format = $request->input('format', 'json');

        $dashboard = $this->analyticsService->getUserDashboard($user);

        if ($format === 'csv') {
            // CSV export logic would go here
            return response()->json([
                'success' => false,
                'message' => 'CSV export coming soon',
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $dashboard,
            'exported_at' => now(),
        ]);
    }
}
