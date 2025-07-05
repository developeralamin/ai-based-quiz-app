<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiChatController extends Controller
{
    /**
     * Display the AI chat page
     * @return Response
     */
    public function index(): Response
    {
        return Inertia::render('AiChat/Index', [
            'conversations' => [
                ['id' => 1, 'title' => 'Math Help Session', 'last_message' => 'Can you explain calculus?', 'updated_at' => '2024-01-15'],
                ['id' => 2, 'title' => 'Physics Questions', 'last_message' => 'What is quantum mechanics?', 'updated_at' => '2024-01-14'],
                ['id' => 3, 'title' => 'Study Tips', 'last_message' => 'How to improve memory?', 'updated_at' => '2024-01-13'],
            ]
        ]);
    }
} 