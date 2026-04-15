import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect } from 'react';
import { ClockIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

export default function HistoryIndex({ auth, activities }) {
  const [quizActivities, setQuizActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [attemptDetails, setAttemptDetails] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [filter, setFilter] = useState('all'); // all, excellent, good, fair, poor
  const [sortBy, setSortBy] = useState('recent'); // recent, score_high, score_low
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    fetchQuizHistory();
  }, [pagination.current_page, filter, sortBy]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchQuizHistory(1);
      }, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchQuizHistory = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quiz/history?page=${page}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }

      const data = await response.json();
      if (data.success) {
        let filteredData = data.data;

        // Apply filter
        if (filter !== 'all') {
          filteredData = filteredData.filter(item => {
            const status = item.quiz?.getPerformanceStatus?.() || item.performance_status || 'Fair';
            const statusLower = status.toLowerCase();
            return statusLower.includes(filter);
          });
        }

        // Apply sorting
        if (sortBy === 'score_high') {
          filteredData.sort((a, b) => b.score - a.score);
        } else if (sortBy === 'score_low') {
          filteredData.sort((a, b) => a.score - b.score);
        }

        setQuizActivities(filteredData);
        setPagination(data.pagination);
        setError('');
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to load quiz history');
      setQuizActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttemptDetails = async (attemptId) => {
    try {
      const response = await fetch(`/api/quiz/attempt/${attemptId}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch attempt details');
      }

      const data = await response.json();
      if (data.success) {
        setAttemptDetails(data.attempt);
        setShowDetails(true);
        setSelectedAttempt(attemptId);
      }
    } catch (err) {
      console.error('Error fetching attempt details:', err);
      setError('Failed to load attempt details');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-blue-100 text-blue-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getPerformanceColor = (status) => {
    if (status === 'Excellent') return 'bg-green-100 text-green-700';
    if (status === 'Good') return 'bg-blue-100 text-blue-700';
    if (status === 'Fair') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getPerformanceIcon = (status) => {
    if (status === 'Excellent') return '⭐';
    if (status === 'Good') return '👍';
    if (status === 'Fair') return '📊';
    return '📝';
  };

  return (
    <AuthenticatedLayout>
      <Head title="History" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Quiz History</h1>
              <p className="text-gray-600 mt-1">Track your learning journey and progress</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => fetchQuizHistory(1)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                ↻ Refresh
              </button>
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Auto-refresh</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Filters and Sort */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Performance</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Attempts</option>
                  <option value="excellent">Excellent (80%+)</option>
                  <option value="good">Good (60-79%)</option>
                  <option value="fair">Fair (40-59%)</option>
                  <option value="poor">Poor (Below 40%)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="recent">Most Recent</option>
                  <option value="score_high">Highest Score</option>
                  <option value="score_low">Lowest Score</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="inline-flex h-8 w-8 bg-purple-600 rounded-full animate-pulse"></div>
                <p className="text-gray-600 mt-4">Loading your quiz history...</p>
              </div>
            </div>
          ) : quizActivities.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <QuestionMarkCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter !== 'all' ? 'No matching attempts' : 'No quiz attempts yet'}
              </h3>
              <p className="text-gray-600">
                {filter !== 'all'
                  ? 'Try changing your filter settings'
                  : 'Start taking quizzes to see your activity history'}
              </p>
            </div>
          ) : (
            <>
              {/* Quiz History Cards */}
              <div className="space-y-4">
                {quizActivities.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {attempt.quiz?.title || 'Untitled Quiz'}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(attempt.score)}`}>
                            {attempt.score.toFixed(2)}%
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPerformanceColor(attempt.performance_status)}`}>
                            {getPerformanceIcon(attempt.performance_status)} {attempt.performance_status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          <ClockIcon className="h-4 w-4 inline mr-2" />
                          {formatDate(attempt.completed_at)}
                        </p>
                        <div className="flex gap-6 text-sm">
                          <span className="text-green-600 font-semibold">
                            ✓ Correct: {attempt.correct_answers}/{attempt.total_questions}
                          </span>
                          <span className="text-red-600 font-semibold">
                            ✗ Wrong: {attempt.wrong_answers}/{attempt.total_questions}
                          </span>
                          <span className="text-gray-600">
                            Total Questions: {attempt.total_questions}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => fetchAttemptDetails(attempt.id)}
                        className="ml-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium text-sm"
                      >
                        View Details
                      </button>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{Math.round((attempt.correct_answers / attempt.total_questions) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${(attempt.correct_answers / attempt.total_questions) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <button
                    onClick={() => setPagination({...pagination, current_page: pagination.current_page - 1})}
                    disabled={pagination.current_page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => {
                    const startPage = Math.max(1, pagination.current_page - 2);
                    return startPage + i;
                  }).map((page) => (
                    <button
                      key={page}
                      onClick={() => setPagination({...pagination, current_page: page})}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        pagination.current_page === page
                          ? 'bg-purple-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setPagination({...pagination, current_page: pagination.current_page + 1})}
                    disabled={pagination.current_page === pagination.last_page}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          {/* Details Modal */}
          {showDetails && attemptDetails && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Quiz Attempt Details</h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-white hover:text-gray-200 text-2xl font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="overflow-y-auto flex-1">
                  <div className="p-6">
                    <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Overall Score</p>
                          <p className="text-2xl font-bold text-purple-700">{attemptDetails.score.toFixed(2)}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Correct Answers</p>
                          <p className="text-2xl font-bold text-green-600">{attemptDetails.correct_answers}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Wrong Answers</p>
                          <p className="text-2xl font-bold text-red-600">{attemptDetails.wrong_answers}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Performance</p>
                          <p className={`text-lg font-bold ${attemptDetails.performance_status === 'Excellent' ? 'text-green-600' : attemptDetails.performance_status === 'Good' ? 'text-blue-600' : attemptDetails.performance_status === 'Fair' ? 'text-yellow-600' : 'text-red-600'}`}>
                            {getPerformanceIcon(attemptDetails.performance_status)} {attemptDetails.performance_status}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Breakdown</h3>
                      {attemptDetails.answers.map((answer, idx) => (
                        <div
                          key={idx}
                          className={`p-4 border rounded-lg transition-all ${
                            answer.is_correct
                              ? 'bg-green-50 border-green-200'
                              : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-semibold text-gray-800">
                              Q{answer.question_no}. {answer.question_text}
                            </p>
                            <span className={`text-sm font-bold flex-shrink-0 ml-2 ${answer.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                              {answer.is_correct ? '✓ Correct' : '✗ Incorrect'}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <p className="text-gray-700">
                              <span className="font-semibold">Your Answer:</span> <span className="text-gray-600">{answer.user_answer}</span>
                            </p>
                            {!answer.is_correct && (
                              <p className="text-green-700">
                                <span className="font-semibold">Correct Answer:</span> <span>{answer.correct_answer}</span>
                              </p>
                            )}
                            <p className="text-xs text-gray-600">Type: {answer.question_type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
