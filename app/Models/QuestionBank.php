<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuestionBank extends Model
{
    protected $table = 'question_bank';

    protected $fillable = [
        'user_id',
        'book_id',
        'chapter_id',
        'question_type',
        'topic',
        'difficulty_level',
        'question_text',
        'options',
        'correct_answer',
        'explanation',
        'correct_count',
        'incorrect_count',
        'success_rate',
    ];

    protected $casts = [
        'options' => 'array',
    ];

    /**
     * Get the user who owns this question
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the book this question relates to
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    /**
     * Get the chapter this question relates to
     */
    public function chapter(): BelongsTo
    {
        return $this->belongsTo(BookChapter::class, 'chapter_id');
    }

    /**
     * Update success rate based on performance
     */
    public function updateSuccessRate(): void
    {
        $total = $this->correct_count + $this->incorrect_count;
        if ($total > 0) {
            $this->success_rate = ($this->correct_count / $total) * 100;
            $this->save();
        }
    }

    /**
     * Increment correct count
     */
    public function incrementCorrect(): void
    {
        $this->increment('correct_count');
        $this->updateSuccessRate();
    }

    /**
     * Increment incorrect count
     */
    public function incrementIncorrect(): void
    {
        $this->increment('incorrect_count');
        $this->updateSuccessRate();
    }
}
