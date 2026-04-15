import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BookOpenIcon, MagnifyingGlassIcon, TrashIcon, DownloadIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useState, useRef } from 'react';

export default function BooksIndex({ auth, books, pagination }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [bookList, setBookList] = useState(books);
  const [uploading, setUploading] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    language: 'en',
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('file-input');

    if (!fileInput.files.length) {
      alert('Please select a file');
      return;
    }

    const file = fileInput.files[0];
    const data = new FormData();

    data.append('title', formData.title || file.name);
    data.append('author', formData.author);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('language', formData.language);
    data.append('file', file);

    setUploading(true);

    try {
      const response = await fetch('/api/books/upload', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
        },
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        setBookList([result.book, ...bookList]);
        setShowUploadModal(false);
        setFormData({
          title: '',
          author: '',
          description: '',
          category: '',
          language: 'en',
        });
        fileInputRef.current.value = '';
        alert('Book uploaded successfully!');
      } else {
        alert('Upload failed: ' + result.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
        },
      });

      const result = await response.json();

      if (result.success) {
        setBookList(bookList.filter(book => book.id !== bookId));
        alert('Book deleted successfully!');
      } else {
        alert('Delete failed: ' + result.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred during deletion');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      // Reset to original list
      window.location.reload();
      return;
    }

    try {
      const response = await fetch(`/api/books/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        setBookList(result.books);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const filteredBooks = searchQuery
    ? bookList
    : bookList.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <AuthenticatedLayout>
      <Head title="Books" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Books Library</h1>
              <p className="text-gray-600 mt-1">Manage and organize your study materials</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <BookOpenIcon className="h-5 w-5" />
              Upload Book
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative mb-8">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, author, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </form>

          {/* Books Grid */}
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <div key={book.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="aspect-[3/4] bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center relative group">
                    <BookOpenIcon className="h-16 w-16 text-purple-600" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <a
                        href={`/storage/${book.file_path}`}
                        download
                        className="bg-white text-purple-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="Download"
                      >
                        <DownloadIcon className="h-5 w-5" />
                      </a>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="bg-white text-red-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{book.author || 'Unknown Author'}</p>
                    {book.category && (
                      <p className="text-xs text-purple-600 bg-purple-50 inline-block px-2 py-1 rounded mb-3">
                        {book.category}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mb-3">
                      {new Date(book.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <a
                        href={`/storage/${book.file_path}`}
                        download
                        className="flex-1 bg-purple-100 text-purple-700 px-3 py-2 rounded text-sm hover:bg-purple-200 transition-colors text-center font-medium flex items-center justify-center gap-1"
                      >
                        <DownloadIcon className="h-4 w-4" />
                        Download
                      </a>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="flex-1 bg-red-50 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-100 transition-colors font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No books found' : 'No books yet'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? 'Try searching with different keywords'
                  : 'Start by uploading your first book to your library'}
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Upload Your First Book
              </button>
            </div>
          )}

          {/* Upload Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Book</h2>

                  <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Book Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter book title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Author
                      </label>
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Book author"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., Science, Math"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        placeholder="Book description"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Language
                      </label>
                      <select
                        value={formData.language}
                        onChange={(e) => setFormData({...formData, language: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="bn">Bangla</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        File (PDF, DOC, DOCX) *
                      </label>
                      <input
                        ref={fileInputRef}
                        id="file-input"
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Max file size: 50MB</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowUploadModal(false)}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        disabled={uploading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium disabled:opacity-50"
                        disabled={uploading}
                      >
                        {uploading ? 'Uploading...' : 'Upload'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
