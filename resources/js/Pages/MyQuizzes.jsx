import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
  TrashIcon,
  ArrowPathIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

export default function MyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, completed, in-progress
  const [sortBy, setSortBy] = useState('recent'); // recent, score, title

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/analytics/recent-quizzes', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setQuizzes(data.quizzes || data.data?.recent_quizzes || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    if (filter === 'completed') return quiz.is_completed;
    if (filter === 'in-progress') return !quiz.is_completed;
    return true;
  });

  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === 'score') return (b.score || 0) - (a.score || 0);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <AuthenticatedLayout>
      <Head title="My Quizzes" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Quizzes</h1>
        <p className="text-gray-600 mt-2">View and manage all your quizzes</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="all">All Quizzes</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="recent">Most Recent</option>
              <option value="score">Highest Score</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          {/* Action */}
          <div className="flex items-end">
            <Link
              href="/quiz/form"
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-center"
            >
              Create New Quiz
            </Link>
          </div>
        </div>
      </div>

      {/* Quizzes List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : sortedQuizzes.length > 0 ? (
          sortedQuizzes.map((quizResult) => {
            const quizData = quizResult.quiz || {};
            const quizTitle = quizData.title || 'Untitled Quiz';
            const questionCount = quizResult.total_count || 0;
            const score = quizResult.score || 0;
            const isCompleted = quizResult.completed_at !== null;
            const topicName = quizData.topic;

            return (
            <div
              key={quizResult.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{quizTitle}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(isCompleted ? 'passed' : 'in-progress')}`}>
                    {isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <CheckCircleIcon className="w-4 h-4" />
                    {questionCount} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    {quizData.duration_minutes || 0} mins
                  </span>
                  {topicName && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                      {topicName}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {new Date(quizResult.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Score and Actions */}
              <div className="flex items-center gap-6">
                {isCompleted && score !== null && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Score</p>
                    <p className={`text-2xl font-bold ${getScoreColor(score)}`}>
                      {Math.round(score)}%
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  {isCompleted ? (
                    <>
                      <Link
                        href={`/quiz/${quizData.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="View Quiz"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>
                      <Link
                        href={`/quiz/${quizData.id}`}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="Retake Quiz"
                      >
                        <ArrowPathIcon className="w-5 h-5" />
                      </Link>
                    </>
                  ) : (
                    <Link
                      href={`/quiz/${quizData.id}`}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                      title="Continue Quiz"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      // Delete quiz logic
                      if (window.confirm('Are you sure you want to delete this quiz?')) {
                        console.log('Delete quiz:', quizData.id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete Quiz"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <ExclamationCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No quizzes found</p>
            <Link
              href="/quiz/form"
              className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Create Your First Quiz
            </Link>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
