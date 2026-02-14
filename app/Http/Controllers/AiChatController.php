<?php

namespace App\Http\Controllers;

use App\Models\AIQuiz;
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
        $conversation = AIQuiz::where('user_id', auth()->id())
            ->where('id', $id)
            ->firstOrFail();    

        return Inertia::render('AiChat/Details', [
            'conversation' => $conversation
        ]);
    } 
}