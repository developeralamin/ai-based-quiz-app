<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AIQuiz extends Model
{
    protected $table = 'a_i_quizzes';

    protected $guarded = [];

    protected $casts = [
        'full_response' => 'array',
    ];

    /**
     * Get the user that owns the quiz
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the book this quiz is based on
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    /**
     * Get all quiz results for this quiz
     */
    public function quizResults(): HasMany
    {
        return $this->hasMany(QuizResult::class, 'quiz_id');
    }

    /**
     * Get explanations for this quiz
     */
    public function explanations(): HasMany
    {
        return $this->hasMany(QuizExplanation::class, 'quiz_id');
    }

    /**
     * Get adaptive sessions for this quiz
     */
    public function adaptiveSessions(): HasMany
    {
        return $this->hasMany(AdaptiveQuizSession::class, 'quiz_id');
    }

    /**
     * Get schedules for this quiz
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(QuizSchedule::class, 'quiz_id');
    }
}
