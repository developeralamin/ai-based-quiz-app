<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
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
use App\Http\Controllers\BookChapterController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\AdaptiveQuizController;

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

    // Quiz routes
    Route::get('/quiz/form', function () {
        return Inertia::render('Quiz/AdvancedForm');
    })->name('quiz.form');
    Route::post('/quiz/generate', [QuizController::class, 'generateQuiz'])->name('quiz.store');
    Route::post('/quiz/generate-advanced', [QuizController::class, 'generateAdvancedQuiz'])->name('quiz.generate-advanced');
    Route::post('/quiz/generate-from-chapter', [QuizController::class, 'generateFromChapter'])->name('quiz.generate-from-chapter');
    Route::post('/quiz/submit-result', [QuizController::class, 'submitQuizResult'])->name('quiz.submit-result');
    Route::get('/quiz/{quiz}', [QuizController::class, 'show'])->name('quiz.show');
    Route::get('/quiz-result/{result}', [QuizController::class, 'getResult'])->name('quiz.result');

    // Books routes
    Route::resource('books', BooksController::class);
    Route::get('/api/books', [BooksController::class, 'getList'])->name('api.books.list');
    Route::get('/api/quizzes', function () {
        // Return user's generated quizzes for adaptive quiz page
        $quizzes = \App\Models\AIQuiz::where('user_id', Auth::id())
            ->select('id', 'title', 'full_response', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($quiz) {
                $response = $quiz->full_response;
                if (is_string($response)) {
                    $response = json_decode($response, true) ?? [];
                }
                return [
                    'id' => $quiz->id,
                    'title' => $quiz->title,
                    'question_count' => count($response),
                    'starting_difficulty' => 'medium',
                    'duration_minutes' => count($response) * 2, // Estimate
                    'topic' => $quiz->title,
                    'description' => 'Generated quiz',
                    'created_at' => $quiz->created_at
                ];
            });

        return response()->json([
            'success' => true,
            'quizzes' => $quizzes
        ], 200, [
            'Content-Type' => 'application/json'
        ]);
    })->name('api.quizzes.list');

    // Book Chapter routes
    Route::get('/books/{book}/chapters', [BookChapterController::class, 'index'])->name('chapters.index');
    Route::get('/chapters/{chapter}', [BookChapterController::class, 'show'])->name('chapters.show');
    Route::post('/chapters/extract', [BookChapterController::class, 'extract'])->name('chapters.extract');
    Route::get('/chapters/{chapter}/summary', [BookChapterController::class, 'getSummary'])->name('chapters.summary');
    Route::get('/chapters/{chapter}/topics', [BookChapterController::class, 'getKeyTopics'])->name('chapters.topics');

    // Analytics routes
    Route::prefix('analytics')->group(function () {
        Route::get('/dashboard', [AnalyticsController::class, 'dashboard'])->name('analytics.dashboard');
        Route::get('/stats', [AnalyticsController::class, 'overallStats'])->name('analytics.stats');
        Route::get('/recent-quizzes', [AnalyticsController::class, 'recentQuizzes'])->name('analytics.recent');
        Route::get('/topics', [AnalyticsController::class, 'topicPerformance'])->name('analytics.topics');
        Route::get('/weak-areas', [AnalyticsController::class, 'weakAreas'])->name('analytics.weak-areas');
        Route::get('/trends', [AnalyticsController::class, 'learningTrends'])->name('analytics.trends');
        Route::get('/reading-progress', [AnalyticsController::class, 'readingProgress'])->name('analytics.reading');
        Route::get('/recommendations', [AnalyticsController::class, 'recommendations'])->name('analytics.recommendations');
        Route::get('/difficulty-performance', [AnalyticsController::class, 'difficultyPerformance'])->name('analytics.difficulty');
        Route::get('/book-performance', [AnalyticsController::class, 'bookPerformance'])->name('analytics.books');
        Route::get('/quiz/{result}', [AnalyticsController::class, 'quizAnalysis'])->name('analytics.quiz');
        Route::get('/export', [AnalyticsController::class, 'export'])->name('analytics.export');
    });

    // Adaptive Quiz routes
    Route::prefix('adaptive-quiz')->group(function () {
        Route::post('/start', [AdaptiveQuizController::class, 'start'])->name('adaptive.start');
        Route::get('/next-question', [AdaptiveQuizController::class, 'getNextQuestion'])->name('adaptive.next');
        Route::post('/submit-answer', [AdaptiveQuizController::class, 'submitAnswer'])->name('adaptive.submit');
        Route::post('/complete', [AdaptiveQuizController::class, 'complete'])->name('adaptive.complete');
        Route::get('/summary', [AdaptiveQuizController::class, 'getSummary'])->name('adaptive.summary');
    });

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

    // Frontend navigation routes
    Route::get('/my-quizzes', function () {
        return Inertia::render('MyQuizzes');
    })->name('my-quizzes');

    Route::get('/analytics', function () {
        return Inertia::render('Analytics/Dashboard');
    })->name('analytics-page');

    Route::get('/reading-progress', function () {
        return Inertia::render('ReadingProgress');
    })->name('reading-progress-page');

    Route::get('/adaptive-quiz-page', function () {
        return Inertia::render('AdaptiveQuizPage');
    })->name('adaptive-quiz-page');
});

require __DIR__.'/auth.php';
