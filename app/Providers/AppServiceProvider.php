<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Models\Book;
use App\Models\AIQuiz;
use App\Models\QuizResult;
use App\Policies\BookPolicy;
use App\Policies\AIQuizPolicy;
use App\Policies\QuizResultPolicy;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Register policies
        Gate::policy(Book::class, BookPolicy::class);
        Gate::policy(AIQuiz::class, AIQuizPolicy::class);
        Gate::policy(QuizResult::class, QuizResultPolicy::class);
    }
}
