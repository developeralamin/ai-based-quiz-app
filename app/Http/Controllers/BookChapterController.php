<?php

namespace App\Http\Controllers;

use App\Models\BookChapter;
use App\Models\Book;
use App\Services\BookChapterExtractionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class BookChapterController extends Controller
{
    private BookChapterExtractionService $extractionService;

    public function __construct(BookChapterExtractionService $extractionService)
    {
        $this->extractionService = $extractionService;
    }

    /**
     * Get all chapters for a book
     */
    public function index(Book $book): JsonResponse
    {
        $this->authorize('view', $book);

        $chapters = $book->chapters()
            ->orderBy('chapter_number')
            ->get();

        return response()->json(['chapters' => $chapters]);
    }

    /**
     * Get a specific chapter
     */
    public function show(BookChapter $chapter): JsonResponse
    {
        $this->authorize('view', $chapter->book);

        return response()->json([
            'chapter' => $chapter->load(['quizzes', 'questions']),
            'quizzes' => $chapter->quizzes()->get(),
            'questions' => $chapter->questions()
                ->where('user_id', Auth::id())
                ->get(),
        ]);
    }

    /**
     * Extract chapters from PDF
     */
    public function extract(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'book_id' => 'required|integer|exists:books,id',
        ]);

        $book = Book::findOrFail($validated['book_id']);
        $this->authorize('view', $book);

        try {
            $success = $this->extractionService->extractAndStoreChapters($book);

            if (!$success) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to extract chapters from PDF'
                ], 400);
            }

            $chapters = $book->chapters()
                ->orderBy('chapter_number')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Chapters extracted successfully',
                'chapters' => $chapters,
                'count' => $chapters->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error extracting chapters: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get chapter summary
     */
    public function getSummary(BookChapter $chapter): JsonResponse
    {
        $this->authorize('view', $chapter->book);

        return response()->json([
            'chapter_number' => $chapter->chapter_number,
            'title' => $chapter->title,
            'summary' => $chapter->summary,
            'key_topics' => $chapter->key_topics ?? [],
            'page_range' => [
                'start' => $chapter->page_start,
                'end' => $chapter->page_end,
            ],
        ]);
    }

    /**
     * Get chapter key topics
     */
    public function getKeyTopics(BookChapter $chapter): JsonResponse
    {
        $this->authorize('view', $chapter->book);

        return response()->json([
            'topics' => $chapter->key_topics ?? [],
            'extracted_at' => $chapter->updated_at,
        ]);
    }
}
