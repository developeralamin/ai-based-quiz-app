<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdaptiveQuizSession extends Model
{
    protected $table = 'adaptive_quiz_sessions';

    protected $fillable = [
        'user_id',
        'quiz_id',
        'current_difficulty',
        'current_question_index',
        'consecutive_correct',
        'consecutive_incorrect',
        'increase_difficulty',
        'decrease_difficulty',
        'performance_trend',
        'difficulty_history',
        'is_active',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'performance_trend' => 'array',
        'difficulty_history' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the user
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
     * Evaluate answer and adjust difficulty
     */
    public function evaluateAnswer(bool $isCorrect): void
    {
        if ($isCorrect) {
            $this->consecutive_correct += 1;
            $this->consecutive_incorrect = 0;

            // Increase difficulty after 3 consecutive correct answers
            if ($this->consecutive_correct >= 3) {
                $this->increaseDifficulty();
            }
        } else {
            $this->consecutive_incorrect += 1;
            $this->consecutive_correct = 0;

            // Decrease difficulty after 2 consecutive incorrect answers
            if ($this->consecutive_incorrect >= 2) {
                $this->decreaseDifficulty();
            }
        }

        // Track performance trend
        $trend = $this->performance_trend ?? [];
        $trend[] = ['answer' => $isCorrect, 'difficulty' => $this->current_difficulty, 'timestamp' => now()];
        $this->performance_trend = $trend;

        $this->save();
    }

    /**
     * Increase difficulty level
     */
    private function increaseDifficulty(): void
    {
        if ($this->current_difficulty === 'easy') {
            $this->current_difficulty = 'medium';
            $this->increase_difficulty = true;
        } elseif ($this->current_difficulty === 'medium') {
            $this->current_difficulty = 'hard';
            $this->increase_difficulty = true;
        }

        $this->recordDifficultyChange('increase');
    }

    /**
     * Decrease difficulty level
     */
    private function decreaseDifficulty(): void
    {
        if ($this->current_difficulty === 'hard') {
            $this->current_difficulty = 'medium';
            $this->decrease_difficulty = true;
        } elseif ($this->current_difficulty === 'medium') {
            $this->current_difficulty = 'easy';
            $this->decrease_difficulty = true;
        }

        $this->recordDifficultyChange('decrease');
    }

    /**
     * Record difficulty change in history
     */
    private function recordDifficultyChange(string $change): void
    {
        $history = $this->difficulty_history ?? [];
        $history[] = [
            'action' => $change,
            'new_difficulty' => $this->current_difficulty,
            'timestamp' => now()
        ];
        $this->difficulty_history = $history;
    }
}
