<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AIQuiz extends Model
{
    
    protected $table = 'a_i_quizzes';

    protected $guarded = [];

    protected $casts = [
        'full_response' => 'array', 
    ];

}
