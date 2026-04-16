<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BookChapter extends Model
{
    protected $table = 'book_chapters';

    protected $fillable = [
        'book_id',
        'chapter_number',
        'title',
        'content',
        'page_start',
        'page_end',
        'summary',
        'key_topics',
    ];

    protected $casts = [
        'key_topics' => 'array',
    ];

    /**
     * Get the book that owns this chapter
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    /**
     * Get all quizzes generated from this chapter
     */
    public function quizzes(): HasMany
    {
        return $this->hasMany(AIQuiz::class, 'chapter', 'chapter_number');
    }

    /**
     * Get all questions from this chapter
     */
    public function questions(): HasMany
    {
        return $this->hasMany(QuestionBank::class, 'chapter_id');
    }

    /**
     * Extract key topics from chapter content
     */
    public function extractKeyTopics(): array
    {
        // This can be enhanced with AI-powered topic extraction
        $content = $this->content;

        // Simple keyword extraction (can be enhanced with AI)
        $keywords = [];
        $words = preg_split('/\s+/', strtolower($content));

        // Filter common words
        $commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'from', 'is', 'are', 'was', 'were'];

        $filtered = array_filter($words, function($word) use ($commonWords) {
            return !in_array($word, $commonWords) && strlen($word) > 3;
        });

        // Get most frequent words
        $frequency = array_count_values($filtered);
        arsort($frequency);
        $keywords = array_keys(array_slice($frequency, 0, 10));

        return $keywords;
    }
}
