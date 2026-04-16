<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Store detailed explanations for quiz answers
     */
    public function up(): void
    {
        if (Schema::hasTable('quiz_explanations')) {
            return;
        }

        Schema::create('quiz_explanations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained('a_i_quizzes')->onDelete('cascade');
            $table->integer('question_number');
            $table->longText('question_text');
            $table->string('correct_answer');
            $table->longText('explanation');
            $table->longText('additional_notes')->nullable();
            $table->json('related_content')->nullable();
            $table->timestamps();

            $table->unique(['quiz_id', 'question_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_explanations');
    }
};
