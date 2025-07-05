<?php

namespace App\Http\Controllers;

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
        return Inertia::render('History/Index', [
            'activities' => [
                ['id' => 1, 'type' => 'quiz', 'title' => 'Completed Math Quiz', 'date' => '2024-01-15', 'score' => '85%'],
                ['id' => 2, 'type' => 'study', 'title' => 'Studied Physics Chapter 3', 'date' => '2024-01-14', 'duration' => '2 hours'],
                ['id' => 3, 'type' => 'note', 'title' => 'Created Chemistry Notes', 'date' => '2024-01-13', 'pages' => 5],
                ['id' => 4, 'type' => 'ai_chat', 'title' => 'AI Chat Session', 'date' => '2024-01-12', 'messages' => 15],
            ]
        ]);
    }
} 