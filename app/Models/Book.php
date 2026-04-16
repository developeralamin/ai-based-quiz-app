<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'author',
        'description',
        'file_path',
        'cover_image',
    ];

    protected $appends = [
        'cover_url',
        'file_url',
    ];

    /**
     * Get the user that owns the book.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all chapters of this book
     */
    public function chapters(): HasMany
    {
        return $this->hasMany(BookChapter::class);
    }

    /**
     * Get all quizzes generated from this book
     */
    public function quizzes(): HasMany
    {
        return $this->hasMany(AIQuiz::class);
    }

    /**
     * Get all questions from this book
     */
    public function questions(): HasMany
    {
        return $this->hasMany(QuestionBank::class);
    }

    /**
     * Get reading progress for all users
     */
    public function readingProgress(): HasMany
    {
        return $this->hasMany(UserReadingProgress::class);
    }

    /**
     * Get performance analytics for all users
     */
    public function performanceAnalytics(): HasMany
    {
        return $this->hasMany(UserPerformanceAnalytics::class);
    }

    /**
     * Get the cover image URL.
     */
    public function getCoverUrlAttribute(): string
    {
        if ($this->cover_image) {
            return asset('storage/' . $this->cover_image);
        }
        return asset('images/book-placeholder.jpg');
    }

    /**
     * Get the file URL.
     */
    public function getFileUrlAttribute(): string
    {
        return asset('storage/' . $this->file_path);
    }

    /**
     * Get user's reading progress for this book
     */
    public function getUserProgress($userId)
    {
        return $this->readingProgress()->where('user_id', $userId)->first();
    }

    /**
     * Get user's performance analytics for this book
     */
    public function getUserPerformance($userId)
    {
        return $this->performanceAnalytics()
            ->where('user_id', $userId)
            ->whereNull('topic')
            ->first();
    }
}
