<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserReadingProgress extends Model
{
    protected $table = 'user_reading_progress';

    protected $fillable = [
        'user_id',
        'book_id',
        'chapters_read',
        'total_chapters',
        'progress_percentage',
        'current_page',
        'total_pages',
        'last_read_at',
        'total_reading_time_minutes',
        'chapters_completed',
    ];

    protected $casts = [
        'chapters_completed' => 'array',
        'last_read_at' => 'datetime',
    ];

    /**
     * Get the user
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the book
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    /**
     * Update reading progress
     */
    public function updateProgress(int $chaptersRead, int $currentPage, int $readingTimeMinutes): void
    {
        $this->chapters_read = $chaptersRead;
        $this->current_page = $currentPage;
        $this->total_reading_time_minutes += $readingTimeMinutes;
        $this->last_read_at = now();

        // Calculate progress percentage
        if ($this->total_chapters) {
            $this->progress_percentage = ($chaptersRead / $this->total_chapters) * 100;
        } elseif ($this->total_pages) {
            $this->progress_percentage = ($currentPage / $this->total_pages) * 100;
        }

        $this->save();
    }

    /**
     * Mark a chapter as completed
     */
    public function markChapterCompleted(int $chapterNumber): void
    {
        $completed = $this->chapters_completed ?? [];

        if (!in_array($chapterNumber, $completed)) {
            $completed[] = $chapterNumber;
            $this->chapters_completed = $completed;
            $this->save();
        }
    }

    /**
     * Get reading streak days
     */
    public function getReadingStreak(): int
    {
        // Implementation for calculating reading streak
        // This would count consecutive days with reading activity
        return 0; // Placeholder
    }
}
