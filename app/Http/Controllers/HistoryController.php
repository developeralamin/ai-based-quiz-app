<?php

namespace App\Http\Controllers;

use App\Models\QuizResult;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HistoryController extends Controller
{
    /**
     * Display the history page
     * @return Response
     */
    public function index(): Response
    {
        // Fetch quiz results for the authenticated user
        $quizResults = QuizResult::where('user_id', auth()->id())
            ->with(['quiz'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($result) {
                return [
                    'id' => $result->id,
                    'quiz_id' => $result->quiz_id,
                    'type' => 'quiz',
                    'title' => $result->quiz->title ?? 'Quiz',
                    'date' => $result->created_at->format('Y-m-d'),
                    'score' => round($result->score, 2) . '%',
                    'correct' => $result->correct_count,
                    'total' => $result->total_count,
                ];
            });

        // Get stats
        $totalQuizzes = $quizResults->count();
        $averageScore = $quizResults->isEmpty() ? 0 : $quizResults->avg(function ($r) {
            return floatval(str_replace('%', '', $r['score']));
        });

        return Inertia::render('History/Index', [
            'activities' => $quizResults,
            'stats' => [
                'totalQuizzes' => $totalQuizzes,
                'averageScore' => round($averageScore, 2),
                'studyHours' => 0, // Can be calculated from timestamps if needed
                'notesCreated' => 0, // Can be fetched from Notes model if available
            ]
        ]);
    }
}
