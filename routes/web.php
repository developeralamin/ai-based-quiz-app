<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\BooksController;
use App\Http\Controllers\AiToolsController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\NotesController;
use App\Http\Controllers\AiChatController;
use App\Http\Controllers\StudyCalendarController;
use App\Http\Controllers\QuestionBankController;
use App\Http\Controllers\SettingsController;

Route::get('/', function () {
    return Inertia::render('WelcomeEducation', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/quiz/form', [QuizController::class, 'quizForm'])->name('quiz.form');
    Route::post('/quiz/generate', [QuizController::class, 'generateQuiz'])->name('quiz.store');

    // Books routes
    Route::get('/books', [BooksController::class, 'index'])->name('books.index');

    // AI Tools routes
    Route::get('/ai-tools', [AiToolsController::class, 'index'])->name('ai-tools.index');

    // History routes
    Route::get('/history', [HistoryController::class, 'index'])->name('history.index');

    // Notes routes
    Route::get('/notes', [NotesController::class, 'index'])->name('notes.index');

    // AI Chat routes
    Route::get('/ai-chat', [AiChatController::class, 'index'])->name('ai-chat.index');
    Route::get('/ai-chat/details/{id}', [AiChatController::class, 'details'])->name('ai-chat.details');
   
    // Study Calendar routes
    Route::get('/study-calendar', [StudyCalendarController::class, 'index'])->name('study-calendar.index');

    // Question Bank routes
    Route::get('/question-bank', [QuestionBankController::class, 'index'])->name('question-bank.index');

    // Settings routes
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');

    // Test route for sidebar functionalit
});

require __DIR__.'/auth.php';
