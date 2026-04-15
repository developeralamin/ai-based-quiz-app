<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get all quizzes created by this user
     */
    public function quizzes()
    {
        return $this->hasMany(AIQuiz::class);
    }

    /**
     * Get all quiz attempts by this user
     */
    public function quizAttempts()
    {
        return $this->hasMany(QuizAttempt::class);
    }

    /**
     * Get dashboard statistics for the user
     */
    public function getQuizStats()
    {
        $attempts = $this->quizAttempts()->where('status', 'completed')->get();

        return [
            'total_quizzes_attempted' => $attempts->count(),
            'total_correct_answers' => $attempts->sum('correct_answers'),
            'total_wrong_answers' => $attempts->sum('wrong_answers'),
            'average_score' => $attempts->avg('score'),
            'best_score' => $attempts->max('score'),
            'total_questions_answered' => $attempts->sum('total_questions'),
        ];
    }
}

