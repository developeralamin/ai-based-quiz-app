<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuizAttempt extends Model
{
    protected $fillable = [
        'user_id',
        'a_i_quiz_id',
        'quiz_data',
        'total_questions',
        'correct_answers',
        'wrong_answers',
        'score',
        'status',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'quiz_data' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns this quiz attempt
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the AI quiz this attempt is for
     */
    public function quiz(): BelongsTo
    {
        return $this->belongsTo(AIQuiz::class, 'a_i_quiz_id');
    }

    /**
     * Get all answers for this attempt
     */
    public function answers(): HasMany
    {
        return $this->hasMany(QuizAnswer::class);
    }

    /**
     * Get only correct answers
     */
    public function correctAnswers(): HasMany
    {
        return $this->answers()->where('is_correct', true);
    }

    /**
     * Get only incorrect answers
     */
    public function incorrectAnswers(): HasMany
    {
        return $this->answers()->where('is_correct', false);
    }

    /**
     * Calculate and return formatted score with percentage
     */
    public function getScorePercentage(): float
    {
        return round($this->score, 2);
    }

    /**
     * Get performance status based on score
     */
    public function getPerformanceStatus(): string
    {
        if ($this->score >= 80) {
            return 'Excellent';
        } elseif ($this->score >= 60) {
            return 'Good';
        } elseif ($this->score >= 40) {
            return 'Fair';
        } else {
            return 'Needs Improvement';
        }
    }
}
