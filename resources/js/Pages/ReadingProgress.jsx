import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  FireIcon,
  FolderOpenIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

const BookProgressCard = ({ book, progress }) => {
  const chapters = progress?.total_chapters || 0;
  const read = progress?.chapters_read || 0;
  const percentage = chapters > 0 ? Math.round((read / chapters) * 100) : 0;
  const lastRead = progress?.last_read_at ? new Date(progress.last_read_at).toLocaleDateString() : 'Never';

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <BookOpenIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
            <p className="text-sm text-gray-600">{book.author || 'Unknown Author'}</p>
          </div>
        </div>
        {percentage === 100 && (
          <CheckCircleIcon className="w-6 h-6 text-green-600" />
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 bg-purple-50 rounded-lg">
          <p className="text-xs text-gray-600">Chapters</p>
          <p className="text-lg font-bold text-gray-900">{read}/{chapters}</p>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600">Quizzes</p>
          <p className="text-lg font-bold text-gray-900">{book.quiz_count || 0}</p>
        </div>
        <div className="text-center p-2 bg-green-50 rounded-lg">
          <p className="text-xs text-gray-600">Score</p>
          <p className="text-lg font-bold text-green-600">{book.avg_score || '-'}%</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b">
        <span className="flex items-center gap-1">
          <ClockIcon className="w-4 h-4" />
          Last read: {lastRead}
        </span>
        <span className="flex items-center gap-1">
          <FireIcon className="w-4 h-4" />
          {progress?.total_reading_time_minutes || 0} mins read
        </span>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/books/${book.id}`}
          className="flex-1 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition text-center"
        >
          Continue Reading
        </Link>
        {percentage === 100 && (
          <button className="flex-1 px-3 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition">
            Mark as Completed
          </button>
        )}
      </div>
    </div>
  );
};

export default function ReadingProgress() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, completed, in-progress, not-started
  const [stats, setStats] = useState({
    totalBooks: 0,
    booksCompleted: 0,
    inProgress: 0,
    totalReadingTime: 0,
    averageProgress: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/analytics/reading-progress', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const responseData = data.data || data;
      setBooks(responseData.reading_progress || []);
      setStats(responseData.stats || {});
    } catch (error) {
      console.error('Error fetching reading progress:', error);
      setBooks([]);
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBooks = () => {
    return books.filter(b => {
      const progress = b.progress || {};
      const percentage = b.total_chapters ? Math.round((progress.chapters_read / b.total_chapters) * 100) : 0;

      if (filter === 'completed') return percentage === 100;
      if (filter === 'in-progress') return percentage > 0 && percentage < 100;
      if (filter === 'not-started') return percentage === 0;
      return true;
    });
  };

  const filteredBooks = getFilteredBooks();

  return (
    <AuthenticatedLayout>
      <Head title="Reading Progress" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reading Progress</h1>
        <p className="text-gray-600 mt-2">Track your reading journey across all books</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-lg shadow p-6">
          <p className="text-sm opacity-90">Total Books</p>
          <p className="text-3xl font-bold mt-2">{stats.totalBooks}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg shadow p-6">
          <p className="text-sm opacity-90">Completed</p>
          <p className="text-3xl font-bold mt-2">{stats.booksCompleted}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-lg shadow p-6">
          <p className="text-sm opacity-90">In Progress</p>
          <p className="text-3xl font-bold mt-2">{stats.inProgress}</p>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-lg shadow p-6">
          <p className="text-sm opacity-90">Avg Progress</p>
          <p className="text-3xl font-bold mt-2">{Math.round(stats.averageProgress)}%</p>
        </div>
        <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-lg shadow p-6">
          <p className="text-sm opacity-90">Total Time</p>
          <p className="text-3xl font-bold mt-2">{Math.round((stats.totalReadingTime || 0) / 60)}h</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          >
            <option value="all">All Books ({books.length})</option>
            <option value="completed">Completed ({books.filter(b => {
              const p = b.progress || {};
              return b.total_chapters ? Math.round((p.chapters_read / b.total_chapters) * 100) === 100 : false;
            }).length})</option>
            <option value="in-progress">In Progress ({books.filter(b => {
              const p = b.progress || {};
              const pct = b.total_chapters ? Math.round((p.chapters_read / b.total_chapters) * 100) : 0;
              return pct > 0 && pct < 100;
            }).length})</option>
            <option value="not-started">Not Started ({books.filter(b => {
              const p = b.progress || {};
              return b.total_chapters ? Math.round((p.chapters_read / b.total_chapters) * 100) === 0 : false;
            }).length})</option>
          </select>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
          ))
        ) : filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <BookProgressCard key={book.id} book={book} progress={book.progress || {}} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <FolderOpenIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No books found in this category</p>
            <Link
              href="/books"
              className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Browse Books
            </Link>
          </div>
        )}
      </div>

      {/* Reading Statistics */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <ChartBarIcon className="w-5 h-5 text-purple-600" />
          Reading Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{stats.totalBooks}</p>
            <p className="text-gray-600 mt-2">Total Books Started</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{stats.booksCompleted}</p>
            <p className="text-gray-600 mt-2">Books Completed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{Math.round(stats.totalReadingTime / 60)}</p>
            <p className="text-gray-600 mt-2">Hours Spent Reading</p>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
