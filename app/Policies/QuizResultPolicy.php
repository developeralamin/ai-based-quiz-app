<?php

namespace App\Policies;

use App\Models\QuizResult;
use App\Models\User;

class QuizResultPolicy
{
    /**
     * Determine if the user can view the quiz result
     */
    public function view(User $user, QuizResult $result): bool
    {
        return $user->id === $result->user_id;
    }

    /**
     * Determine if the user can create quiz results
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can update the quiz result
     */
    public function update(User $user, QuizResult $result): bool
    {
        return $user->id === $result->user_id;
    }

    /**
     * Determine if the user can delete the quiz result
     */
    public function delete(User $user, QuizResult $result): bool
    {
        return $user->id === $result->user_id;
    }
}
