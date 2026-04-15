<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BooksController extends Controller
{
    /**
     * Display the books page
     * @return Response
     */
    public function index(): Response
    {
        $books = Book::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return Inertia::render('Books/Index', [
            'books' => $books->items(),
            'pagination' => [
                'current_page' => $books->currentPage(),
                'last_page' => $books->lastPage(),
                'per_page' => $books->perPage(),
                'total' => $books->total(),
            ]
        ]);
    }

    /**
     * Store a newly uploaded book
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'author' => 'nullable|string|max:255',
                'description' => 'nullable|string|max:1000',
                'file' => 'required|file|mimes:pdf,doc,docx,txt|max:52428800', // 50MB max
                'category' => 'nullable|string|max:50',
                'language' => 'nullable|string|max:10',
            ]);

            $file = $request->file('file');
            $fileName = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('books/' . auth()->id(), $fileName, 'public');

            $book = Book::create([
                'user_id' => auth()->id(),
                'title' => $request->input('title'),
                'author' => $request->input('author'),
                'description' => $request->input('description'),
                'file_path' => $filePath,
                'file_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
                'category' => $request->input('category'),
                'language' => $request->input('language', 'en'),
                'is_public' => $request->input('is_public', true),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Book uploaded successfully!',
                'book' => $book,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload book: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get a specific book's details
     * @param int $bookId
     * @return JsonResponse
     */
    public function show(int $bookId): JsonResponse
    {
        try {
            $book = Book::where('user_id', auth()->id())
                ->findOrFail($bookId);

            $book->incrementViews();

            return response()->json([
                'success' => true,
                'book' => [
                    'id' => $book->id,
                    'title' => $book->title,
                    'author' => $book->author,
                    'description' => $book->description,
                    'file_path' => $book->file_path,
                    'file_name' => $book->file_name,
                    'file_size' => $book->getFormattedFileSize(),
                    'views' => $book->views,
                    'downloads' => $book->downloads,
                    'category' => $book->category,
                    'language' => $book->language,
                    'created_at' => $book->created_at,
                    'updated_at' => $book->updated_at,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Book not found'], 404);
        }
    }

    /**
     * Update a book's details
     * @param Request $request
     * @param int $bookId
     * @return JsonResponse
     */
    public function update(Request $request, int $bookId): JsonResponse
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'author' => 'nullable|string|max:255',
                'description' => 'nullable|string|max:1000',
                'category' => 'nullable|string|max:50',
                'language' => 'nullable|string|max:10',
                'is_public' => 'nullable|boolean',
            ]);

            $book = Book::where('user_id', auth()->id())
                ->findOrFail($bookId);

            $book->update($request->only([
                'title',
                'author',
                'description',
                'category',
                'language',
                'is_public',
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Book updated successfully!',
                'book' => $book,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update book: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Delete a book
     * @param int $bookId
     * @return JsonResponse
     */
    public function destroy(int $bookId): JsonResponse
    {
        try {
            $book = Book::where('user_id', auth()->id())
                ->findOrFail($bookId);

            // Delete the file from storage
            if (Storage::disk('public')->exists($book->file_path)) {
                Storage::disk('public')->delete($book->file_path);
            }

            // Delete thumbnail if exists
            if ($book->thumbnail_path && Storage::disk('public')->exists($book->thumbnail_path)) {
                Storage::disk('public')->delete($book->thumbnail_path);
            }

            $book->delete();

            return response()->json([
                'success' => true,
                'message' => 'Book deleted successfully!',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete book: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Download a book file
     * @param int $bookId
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function download(int $bookId)
    {
        try {
            $book = Book::where('user_id', auth()->id())
                ->findOrFail($bookId);

            $book->incrementDownloads();

            $filePath = Storage::disk('public')->path($book->file_path);

            return response()->download($filePath, $book->file_name);
        } catch (\Exception $e) {
            abort(404, 'Book not found');
        }
    }

    /**
     * Search books
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $query = $request->input('q');
            $category = $request->input('category');

            $books = Book::where('user_id', auth()->id());

            if ($query) {
                $books = $books->where(function ($q) use ($query) {
                    $q->where('title', 'LIKE', '%' . $query . '%')
                      ->orWhere('author', 'LIKE', '%' . $query . '%')
                      ->orWhere('description', 'LIKE', '%' . $query . '%');
                });
            }

            if ($category) {
                $books = $books->where('category', $category);
            }

            $results = $books->orderBy('created_at', 'desc')->paginate(12);

            return response()->json([
                'success' => true,
                'books' => $results->items(),
                'pagination' => [
                    'current_page' => $results->currentPage(),
                    'last_page' => $results->lastPage(),
                    'per_page' => $results->perPage(),
                    'total' => $results->total(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Search failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get book categories
     * @return JsonResponse
     */
    public function categories(): JsonResponse
    {
        $categories = Book::where('user_id', auth()->id())
            ->select('category')
            ->distinct()
            ->whereNotNull('category')
            ->pluck('category')
            ->toArray();

        return response()->json([
            'success' => true,
            'categories' => $categories,
        ]);
    }
}
