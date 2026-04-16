<?php

namespace App\Http\Controllers;

use App\Models\AIQuiz;
use App\Models\QuizResult;
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
        $quizList = AIQuiz::where('user_id', auth()->id())
            ->where('status', 1)
            ->with('quizResults')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('AiChat/Index', [
            'conversations' => $quizList
        ]);
    }

    /**
     * Display the details of a specific AI chat conversation
     * @param int $id
     * @return Response
     */
    public function details($id): Response
    {
        // Get the quiz conversation - must exist
        $conversation = AIQuiz::where('user_id', auth()->id())
            ->where('id', $id)
            ->firstOrFail();

        // Get the latest quiz result for this quiz (optional)
        $quizResult = QuizResult::where('user_id', auth()->id())
            ->where('quiz_id', $id)
            ->latest()
            ->first();

        return Inertia::render('AiChat/Details', [
            'conversation' => $conversation,
            'quizResult' => $quizResult
        ]);
    } 
}