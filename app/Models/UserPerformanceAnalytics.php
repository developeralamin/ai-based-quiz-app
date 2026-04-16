<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserPerformanceAnalytics extends Model
{
    protected $table = 'user_performance_analytics';

    protected $fillable = [
        'user_id',
        'book_id',
        'topic',
        'difficulty_level',
        'total_quizzes',
        'total_questions',
        'correct_answers',
        'average_score',
        'accuracy_percentage',
        'total_time_minutes',
        'difficulty_distribution',
        'question_type_distribution',
        'trend_percentage',
        'last_quiz_date',
    ];

    protected $casts = [
        'difficulty_distribution' => 'array',
        'question_type_distribution' => 'array',
        'last_quiz_date' => 'datetime',
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
     * Update analytics after a quiz
     */
    public function updateAnalytics(int $correctAnswers, int $totalQuestions, int $timeTaken): void
    {
        $this->total_quizzes += 1;
        $this->total_questions += $totalQuestions;
        $this->correct_answers += $correctAnswers;
        $this->total_time_minutes += intval($timeTaken / 60);

        // Update score
        $this->average_score = ($this->correct_answers / $this->total_questions) * 100;
        $this->accuracy_percentage = $this->average_score;
        $this->last_quiz_date = now();

        $this->save();
    }

    /**
     * Calculate performance trend
     */
    public function calculateTrend(): float
    {
        // This would be enhanced to compare recent performance with previous
        return $this->trend_percentage ?? 0;
    }

    /**
     * Get performance level description
     */
    public function getPerformanceLevel(): string
    {
        if ($this->accuracy_percentage >= 90) {
            return 'Excellent';
        } elseif ($this->accuracy_percentage >= 75) {
            return 'Good';
        } elseif ($this->accuracy_percentage >= 60) {
            return 'Average';
        } else {
            return 'Needs Improvement';
        }
    }
}
