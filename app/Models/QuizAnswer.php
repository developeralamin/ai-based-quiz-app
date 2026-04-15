<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizAnswer extends Model
{
    protected $fillable = [
        'quiz_attempt_id',
        'question_no',
        'question_type',
        'question_text',
        'user_answer',
        'correct_answer',
        'is_correct',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    /**
     * Get the quiz attempt this answer belongs to
     */
    public function attempt(): BelongsTo
    {
        return $this->belongsTo(QuizAttempt::class);
    }

    /**
     * Get human-readable question type
     */
    public function getQuestionTypeLabel(): string
    {
        return match($this->question_type) {
            'multiple-choice' => 'Multiple Choice',
            'true-false' => 'True/False',
            'fill-in-gaps' => 'Fill in the Gaps',
            'short-answer' => 'Short Answer',
            'long-answer' => 'Long Answer',
            default => ucfirst(str_replace('-', ' ', $this->question_type))
        };
    }
}
