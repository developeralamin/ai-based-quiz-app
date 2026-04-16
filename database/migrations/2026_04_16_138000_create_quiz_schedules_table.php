<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Schedule recurring quizzes for spaced repetition
     */
    public function up(): void
    {
        if (Schema::hasTable('quiz_schedules')) {
            return;
        }

        Schema::create('quiz_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('quiz_id')->constrained('a_i_quizzes')->onDelete('cascade');
            $table->enum('frequency', ['daily', 'weekly', 'biweekly', 'monthly', 'once'])->default('once');
            $table->time('scheduled_time')->nullable();
            $table->timestamp('next_scheduled_date')->nullable();
            $table->integer('total_scheduled_count')->default(1);
            $table->integer('completed_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'is_active']);
            $table->index('next_scheduled_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_schedules');
    }
};
