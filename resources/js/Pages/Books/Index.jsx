import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BookOpenIcon, MagnifyingGlassIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function BooksIndex({ auth, books, search: initialSearch }) {
  const [search, setSearch] = useState(initialSearch || '');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    // Build URL with search parameter
    const url = new URL(window.location);
    if (value) {
      url.searchParams.set('search', value);
    } else {
      url.searchParams.delete('search');
    }
    window.history.pushState({}, '', url);
  };

  const handleDelete = (bookId) => {
    if (confirm('Are you sure you want to delete this book?')) {
      router.delete(`/books/${bookId}`);
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Books</h2>}
    >
      <Head title="Books" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Books</h1>
                  <p className="text-gray-600 mt-1">Manage and organize your study materials</p>
                </div>
                <Link
                  href="/books/create"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <BookOpenIcon className="h-5 w-5" />
                  Add Book
                </Link>
              </div>

              {/* Search Bar */}
              <div className="relative mb-6">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books..."
                  value={search}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Books Grid */}
              {books.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {books.map((book) => (
                    <div key={book.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      <Link href={`/books/${book.id}`} className="flex aspect-[3/4] bg-gradient-to-br from-purple-100 to-purple-200 items-center justify-center overflow-hidden">
                        {book.cover_url && !book.cover_url.includes('placeholder') ? (
                          <img
                            src={book.cover_url}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <BookOpenIcon className="h-16 w-16 text-purple-600" />
                        )}
                      </Link>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">{book.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 truncate">by {book.author}</p>
                        <div className="flex gap-2">
                          <Link
                            href={`/books/${book.id}`}
                            className="flex-1 bg-purple-100 text-purple-700 px-3 py-1 rounded text-sm hover:bg-purple-200 transition-colors text-center"
                          >
                            Read
                          </Link>
                          <Link
                            href={`/books/${book.id}/edit`}
                            className="flex-1 bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors flex items-center justify-center"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="flex-1 bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors flex items-center justify-center"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-12">
                  <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {search ? 'No books found' : 'No books yet'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {search
                      ? 'Try adjusting your search terms'
                      : 'Start by adding your first book to your library'
                    }
                  </p>
                  <Link
                    href="/books/create"
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Add Your First Book
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
