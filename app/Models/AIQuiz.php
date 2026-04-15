<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AIQuiz extends Model
{
    
    protected $table = 'a_i_quizzes';

    protected $guarded = [];

    protected $casts = [
        'full_response' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that created this quiz
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all attempts for this quiz
     */
    public function attempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class, 'a_i_quiz_id');
    }

    /**
     * Get questions from the full response
     */
    public function getQuestionsFromResponse(): array
    {
        if (!$this->full_response || !isset($this->full_response['candidates'])) {
            return [];
        }

        try {
            $text = $this->full_response['candidates'][0]['content']['parts'][0]['text'] ?? '';
            preg_match('/\[[\s\S]*\]/', $text, $matches);
            $cleanJson = $matches[0] ?? '';
            $quizArray = json_decode($cleanJson, true);
            
            if (is_array($quizArray)) {
                foreach ($quizArray as $index => &$question) {
                    $question['question_no'] = $index + 1;
                }
                return $quizArray;
            }
        } catch (\Exception $e) {
            return [];
        }

        return [];
    }

    /**
     * Check if quiz has been attempted
     */
    public function hasAttempts(): bool
    {
        return $this->attempts()->exists();
    }

    /**
     * Get total attempts count
     */
    public function getAttemptsCount(): int
    {
        return $this->attempts()->count();
    }

    /**
     * Get best score for this quiz
     */
    public function getBestScore(): ?float
    {
        return $this->attempts()
            ->where('status', 'completed')
            ->max('score');
    }

    /**
     * Get average score for this quiz
     */
    public function getAverageScore(): float
    {
        $average = $this->attempts()
            ->where('status', 'completed')
            ->avg('score');
        
        return round($average ?? 0, 2);
    }
}
