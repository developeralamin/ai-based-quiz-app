<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizExplanation extends Model
{
    protected $table = 'quiz_explanations';

    protected $fillable = [
        'quiz_id',
        'question_number',
        'question_text',
        'correct_answer',
        'explanation',
        'additional_notes',
        'related_content',
    ];

    protected $casts = [
        'related_content' => 'array',
    ];

    /**
     * Get the quiz
     */
    public function quiz(): BelongsTo
    {
        return $this->belongsTo(AIQuiz::class, 'quiz_id');
    }
}
