<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizSchedule extends Model
{
    protected $table = 'quiz_schedules';

    protected $fillable = [
        'user_id',
        'quiz_id',
        'frequency',
        'scheduled_time',
        'next_scheduled_date',
        'total_scheduled_count',
        'completed_count',
        'is_active',
        'notes',
    ];

    protected $casts = [
        'next_scheduled_date' => 'datetime',
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
     * Mark quiz as completed
     */
    public function markCompleted(): void
    {
        $this->completed_count += 1;

        // Check if schedule is done
        if ($this->frequency === 'once' || $this->completed_count >= $this->total_scheduled_count) {
            $this->is_active = false;
        } else {
            // Schedule next occurrence
            $this->scheduleNext();
        }

        $this->save();
    }

    /**
     * Schedule the next quiz based on frequency
     */
    public function scheduleNext(): void
    {
        $nextDate = match ($this->frequency) {
            'daily' => now()->addDay(),
            'weekly' => now()->addWeek(),
            'biweekly' => now()->addWeeks(2),
            'monthly' => now()->addMonth(),
            default => null,
        };

        if ($nextDate) {
            $this->next_scheduled_date = $nextDate;
        }
    }

    /**
     * Check if quiz is due
     */
    public function isDue(): bool
    {
        return $this->is_active && $this->next_scheduled_date && $this->next_scheduled_date <= now();
    }
}
