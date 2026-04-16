<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizResult extends Model
{
    protected $guarded = [];

    protected $casts = [
        'user_answers' => 'array',
        'quiz_questions' => 'array',
        'score' => 'float',
        'correct_count' => 'integer',
        'total_count' => 'integer',
        'question_wise_analysis' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the user who took the quiz
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the quiz
     */
    public function quiz(): BelongsTo
    {
        return $this->belongsTo(AIQuiz::class, 'quiz_id');
    }

    /**
     * Get time taken in minutes
     */
    public function getTimeTakenMinutes(): ?float
    {
        if ($this->time_taken_seconds) {
            return $this->time_taken_seconds / 60;
        }
        return null;
    }

    /**
     * Get performance rating
     */
    public function getPerformanceRating(): string
    {
        if ($this->score >= 90) {
            return 'Excellent';
        } elseif ($this->score >= 75) {
            return 'Good';
        } elseif ($this->score >= 60) {
            return 'Average';
        } elseif ($this->score >= 50) {
            return 'Fair';
        } else {
            return 'Needs Improvement';
        }
    }

    /**
     * Check if quiz is passed
     */
    public function isPassed(int $passingScore = 60): bool
    {
        return $this->score >= $passingScore;
    }
}
