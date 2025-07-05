<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiToolsController extends Controller
{
    /**
     * Display the AI tools page
     * @return Response
     */
    public function index(): Response
    {
        return Inertia::render('AiTools/Index', [
            'tools' => [
                ['id' => 1, 'name' => 'Quiz Generator', 'description' => 'Generate quizzes from any text content', 'icon' => 'quiz'],
                ['id' => 2, 'name' => 'Study Assistant', 'description' => 'AI-powered study companion', 'icon' => 'assistant'],
                ['id' => 3, 'name' => 'Note Summarizer', 'description' => 'Summarize your notes automatically', 'icon' => 'summarize'],
                ['id' => 4, 'name' => 'Flashcard Creator', 'description' => 'Create flashcards from your content', 'icon' => 'flashcard'],
            ]
        ]);
    }
} 