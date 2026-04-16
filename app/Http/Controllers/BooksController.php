<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class BooksController extends Controller
{
    /**
     * Display the books page with search functionality
     * @return Response
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search', '');
        $userId = Auth::id();

        $query = Book::where('user_id', $userId);

        // Search functionality
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $books = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Books/Index', [
            'books' => $books,
            'search' => $search,
        ]);
    }

    /**
     * Show the form for creating a new book
     */
    public function create(): Response
    {
        return Inertia::render('Books/Create');
    }

    /**
     * Store a newly created book in storage
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:pdf|max:102400', // Max 100MB
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // Max 5MB
        ]);

        try {
            // Store PDF file
            $filePath = $request->file('file')->store('books/pdfs', 'public');

            // Store cover image if provided
            $coverPath = null;
            if ($request->hasFile('cover')) {
                $coverPath = $request->file('cover')->store('books/covers', 'public');
            }

            // Create book record
            Book::create([
                'user_id' => Auth::id(),
                'title' => $validated['title'],
                'author' => $validated['author'],
                'description' => $validated['description'] ?? null,
                'file_path' => $filePath,
                'cover_image' => $coverPath,
            ]);

            return redirect()->route('books.index')->with('success', 'Book added successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to upload book: ' . $e->getMessage());
        }
    }

    /**
     * Show a specific book (for reading)
     */
    public function show(Book $book): Response
    {
        // Authorize user
        if ($book->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Books/Show', [
            'book' => $book,
        ]);
    }

    /**
     * Show the form for editing a book
     */
    public function edit(Book $book): Response
    {
        if ($book->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Books/Edit', [
            'book' => $book,
        ]);
    }

    /**
     * Update book in storage
     */
    public function update(Request $request, Book $book): RedirectResponse
    {
        if ($book->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf|max:102400',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        try {
            // Update PDF if provided
            if ($request->hasFile('file')) {
                // Delete old file
                if ($book->file_path) {
                    Storage::disk('public')->delete($book->file_path);
                }
                $book->file_path = $request->file('file')->store('books/pdfs', 'public');
            }

            // Update cover if provided
            if ($request->hasFile('cover')) {
                // Delete old cover
                if ($book->cover_image) {
                    Storage::disk('public')->delete($book->cover_image);
                }
                $book->cover_image = $request->file('cover')->store('books/covers', 'public');
            }

            $book->update([
                'title' => $validated['title'],
                'author' => $validated['author'],
                'description' => $validated['description'] ?? null,
                'file_path' => $book->file_path,
                'cover_image' => $book->cover_image,
            ]);

            return redirect()->route('books.index')->with('success', 'Book updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update book: ' . $e->getMessage());
        }
    }

    /**
     * Delete a book from storage
     */
    public function destroy(Book $book): RedirectResponse
    {
        if ($book->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        try {
            // Delete files
            if ($book->file_path) {
                Storage::disk('public')->delete($book->file_path);
            }
            if ($book->cover_image) {
                Storage::disk('public')->delete($book->cover_image);
            }

            $book->delete();

            return redirect()->route('books.index')->with('success', 'Book deleted successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete book: ' . $e->getMessage());
        }
    }

    /**
     * Get books as JSON (for API)
     */
    public function getList()
    {
        $userId = Auth::id();
        $books = Book::where('user_id', $userId)
            ->select('id', 'title', 'author', 'description', 'cover_image')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'books' => $books
        ]);
    }
}
