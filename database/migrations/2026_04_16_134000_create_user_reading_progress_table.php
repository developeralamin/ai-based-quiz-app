<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Track user's reading progress through books
     */
    public function up(): void
    {
        Schema::create('user_reading_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->integer('chapters_read')->default(0);
            $table->integer('total_chapters')->nullable();
            $table->decimal('progress_percentage', 5, 2)->default(0);
            $table->integer('current_page')->default(0);
            $table->integer('total_pages')->nullable();
            $table->timestamp('last_read_at')->nullable();
            $table->integer('total_reading_time_minutes')->default(0);
            $table->json('chapters_completed')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'book_id']);
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_reading_progress');
    }
};
