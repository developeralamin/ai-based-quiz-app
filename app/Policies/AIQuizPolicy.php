<?php

namespace App\Policies;

use App\Models\AIQuiz;
use App\Models\User;

class AIQuizPolicy
{
    /**
     * Determine if the user can view the quiz
     */
    public function view(User $user, AIQuiz $quiz): bool
    {
        return $user->id === $quiz->user_id;
    }

    /**
     * Determine if the user can create quizzes
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can update the quiz
     */
    public function update(User $user, AIQuiz $quiz): bool
    {
        return $user->id === $quiz->user_id;
    }

    /**
     * Determine if the user can delete the quiz
     */
    public function delete(User $user, AIQuiz $quiz): bool
    {
        return $user->id === $quiz->user_id;
    }
}
