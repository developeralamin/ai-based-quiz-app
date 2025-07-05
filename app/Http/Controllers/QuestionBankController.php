<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuestionBankController extends Controller
{
    /**
     * Display the question bank page
     * @return Response
     */
    public function index(): Response
    {
        return Inertia::render('QuestionBank/Index', [
            'questions' => [
                ['id' => 1, 'question' => 'What is the capital of France?', 'type' => 'multiple_choice', 'subject' => 'Geography', 'difficulty' => 'easy'],
                ['id' => 2, 'question' => 'Solve for x: 2x + 5 = 13', 'type' => 'short_answer', 'subject' => 'Mathematics', 'difficulty' => 'medium'],
                ['id' => 3, 'question' => 'The sun is a star.', 'type' => 'true_false', 'subject' => 'Science', 'difficulty' => 'easy'],
                ['id' => 4, 'question' => 'Explain the process of photosynthesis.', 'type' => 'long_answer', 'subject' => 'Biology', 'difficulty' => 'hard'],
            ]
        ]);
    }
} 