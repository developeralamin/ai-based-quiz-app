<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizResult extends Model
{
    protected $guarded = [];

    protected $casts = [
        'user_answers' => 'array',
        'quiz_questions' => 'array',
        'score' => 'float',
        'correct_count' => 'integer',
        'total_count' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function quiz()
    {
        return $this->belongsTo(AIQuiz::class, 'quiz_id');
    }
}
