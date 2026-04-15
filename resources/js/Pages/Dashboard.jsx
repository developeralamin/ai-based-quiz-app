import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [recentAttempts, setRecentAttempts] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [autoRefresh, setAutoRefresh] = useState(true);

    useEffect(() => {
        fetchDashboardStats();

        // Auto-refresh every 30 seconds
        const interval = autoRefresh ? setInterval(fetchDashboardStats, 30000) : null;
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoRefresh]);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/quiz/dashboard-stats', {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch dashboard stats');
            }

            const data = await response.json();
            if (data.success) {
                setStats(data.stats);
                setRecentAttempts(data.recent_attempts);
                setWeeklyData(data.weekly_data);
                setError('');
            }
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
            setError('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getPerformanceColor = (status) => {
        if (status === 'Excellent') return 'text-green-600 bg-green-50';
        if (status === 'Good') return 'text-blue-600 bg-blue-50';
        if (status === 'Fair') return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'bg-green-100 text-green-800';
        if (score >= 60) return 'bg-blue-100 text-blue-800';
        if (score >= 40) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const maxWeeklyScore = weeklyData.length > 0 ? Math.max(...weeklyData.map(d => d.avg_score || 0)) : 0;

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header with Title and Actions */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Quiz Dashboard</h1>
                            <p className="text-gray-600 mt-1">Track your learning progress and performance</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={fetchDashboardStats}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                                title="Refresh dashboard"
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
                            <Link
                                href="/quiz/form"
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors text-sm font-medium"
                            >
                                + New Quiz
                            </Link>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-center">
                                <div className="inline-flex h-8 w-8 bg-purple-600 rounded-full animate-pulse"></div>
                                <p className="text-gray-600 mt-4">Loading your dashboard...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Stats Cards */}
                            {stats && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                        <p className="text-sm opacity-90 mb-1">Quizzes Attempted</p>
                                        <p className="text-3xl font-bold">{stats.total_quizzes_attempted}</p>
                                        <p className="text-xs opacity-75 mt-2">Total attempts</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                        <p className="text-sm opacity-90 mb-1">Correct Answers</p>
                                        <p className="text-3xl font-bold">{stats.total_correct_answers}</p>
                                        <p className="text-xs opacity-75 mt-2">Total correct</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                        <p className="text-sm opacity-90 mb-1">Wrong Answers</p>
                                        <p className="text-3xl font-bold">{stats.total_wrong_answers}</p>
                                        <p className="text-xs opacity-75 mt-2">Total incorrect</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                        <p className="text-sm opacity-90 mb-1">Average Score</p>
                                        <p className="text-3xl font-bold">{stats.average_score ? stats.average_score.toFixed(2) : '0'}%</p>
                                        <p className="text-xs opacity-75 mt-2">Overall average</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                        <p className="text-sm opacity-90 mb-1">Best Score</p>
                                        <p className="text-3xl font-bold">{stats.best_score ? stats.best_score.toFixed(2) : '0'}%</p>
                                        <p className="text-xs opacity-75 mt-2">Highest score</p>
                                    </div>
                                </div>
                            )}

                            {/* Performance Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                {/* Weekly Performance Chart */}
                                {weeklyData && weeklyData.length > 0 && (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Performance</h2>
                                        <div className="flex items-end justify-between h-64 gap-2">
                                            {weeklyData.map((day, idx) => (
                                                <div key={idx} className="flex-1 flex flex-col items-center">
                                                    <div className="w-full bg-gray-200 rounded-t-lg overflow-hidden relative group">
                                                        <div
                                                            className="w-full bg-gradient-to-t from-purple-500 to-purple-400 transition-all"
                                                            style={{
                                                                height: maxWeeklyScore > 0 ? `${(day.avg_score / maxWeeklyScore) * 100}%` : '0%',
                                                                minHeight: '20px'
                                                            }}
                                                        >
                                                        </div>
                                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                            {day.avg_score.toFixed(1)}%
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-2">{new Date(day.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Accuracy Circle Chart */}
                                {stats && (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
                                        <h2 className="text-xl font-bold text-gray-800 mb-6 w-full">Overall Accuracy</h2>
                                        <div className="relative w-48 h-48 flex items-center justify-center mb-4">
                                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="45"
                                                    fill="none"
                                                    stroke="#e5e7eb"
                                                    strokeWidth="8"
                                                />
                                                {stats.total_questions_answered > 0 && (
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="45"
                                                        fill="none"
                                                        stroke="url(#gradient)"
                                                        strokeWidth="8"
                                                        strokeDasharray={`${(stats.total_correct_answers / stats.total_questions_answered) * 282.744} 282.744`}
                                                        strokeLinecap="round"
                                                        transform="rotate(-90 50 50)"
                                                    />
                                                )}
                                                <defs>
                                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" stopColor="#10b981" />
                                                        <stop offset="100%" stopColor="#059669" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <div className="absolute flex flex-col items-center justify-center">
                                                <p className="text-3xl font-bold text-gray-800">
                                                    {stats.total_questions_answered > 0 ?
                                                        ((stats.total_correct_answers / stats.total_questions_answered) * 100).toFixed(1) :
                                                        '0'
                                                    }%
                                                </p>
                                                <p className="text-sm text-gray-600">Accuracy</p>
                                            </div>
                                        </div>
                                        <p className="text-center text-sm text-gray-600">
                                            {stats.total_correct_answers} correct out of {stats.total_questions_answered}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Recent Attempts */}
                            {recentAttempts && recentAttempts.length > 0 && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold text-gray-800">Recent Quiz Attempts</h2>
                                        <Link
                                            href="/history"
                                            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                        >
                                            View All →
                                        </Link>
                                    </div>
                                    <div className="space-y-3">
                                        {recentAttempts.map((attempt) => (
                                            <div key={attempt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-800">{attempt.quiz_title}</p>
                                                    <p className="text-sm text-gray-600">{formatDate(attempt.completed_at)}</p>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-600">Correct/Wrong</p>
                                                        <p className="font-semibold">
                                                            <span className="text-green-600">{attempt.correct_answers}</span>
                                                            {' / '}
                                                            <span className="text-red-600">{attempt.wrong_answers}</span>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className={`px-4 py-2 rounded-full font-semibold ${getScoreColor(attempt.score)}`}>
                                                            {attempt.score.toFixed(2)}%
                                                        </span>
                                                    </div>
                                                    <div className={`px-3 py-2 rounded-full text-sm font-semibold ${getPerformanceColor(attempt.performance_status)}`}>
                                                        {attempt.performance_status}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No Data State */}
                            {(!recentAttempts || recentAttempts.length === 0) && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400 mb-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Quiz Attempts Yet</h3>
                                    <p className="text-gray-600 mb-4">Start by creating and taking a quiz to see your statistics here.</p>
                                    <Link
                                        href="/quiz/form"
                                        className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                                    >
                                        Take Your First Quiz
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Quiz Dashboard</h1>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-center">
                                <div className="inline-flex h-8 w-8 bg-purple-600 rounded-full animate-pulse"></div>
                                <p className="text-gray-600 mt-4">Loading your dashboard...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Stats Cards */}
                            {stats && (
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-sm">
                                        <p className="text-sm opacity-90 mb-1">Quizzes Attempted</p>
                                        <p className="text-3xl font-bold">{stats.total_quizzes_attempted}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-sm">
                                        <p className="text-sm opacity-90 mb-1">Correct Answers</p>
                                        <p className="text-3xl font-bold">{stats.total_correct_answers}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow-sm">
                                        <p className="text-sm opacity-90 mb-1">Wrong Answers</p>
                                        <p className="text-3xl font-bold">{stats.total_wrong_answers}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-sm">
                                        <p className="text-sm opacity-90 mb-1">Average Score</p>
                                        <p className="text-3xl font-bold">{stats.average_score ? stats.average_score.toFixed(2) : '0'}%</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-sm">
                                        <p className="text-sm opacity-90 mb-1">Best Score</p>
                                        <p className="text-3xl font-bold">{stats.best_score ? stats.best_score.toFixed(2) : '0'}%</p>
                                    </div>
                                </div>
                            )}

                            {/* Recent Attempts */}
                            {recentAttempts && recentAttempts.length > 0 && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Quiz Attempts</h2>
                                    <div className="space-y-3">
                                        {recentAttempts.map((attempt) => (
                                            <div key={attempt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-800">{attempt.quiz_title}</p>
                                                    <p className="text-sm text-gray-600">{formatDate(attempt.completed_at)}</p>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-600">Correct/Wrong</p>
                                                        <p className="font-semibold">
                                                            <span className="text-green-600">{attempt.correct_answers}</span>
                                                            {' / '}
                                                            <span className="text-red-600">{attempt.wrong_answers}</span>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className={`px-4 py-2 rounded-full font-semibold ${getScoreColor(attempt.score)}`}>
                                                            {attempt.score.toFixed(2)}%
                                                        </span>
                                                    </div>
                                                    <div className={`px-3 py-2 rounded-full text-sm font-semibold ${getPerformanceColor(attempt.performance_status)}`}>
                                                        {attempt.performance_status}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Performance Overview */}
                            {stats && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Performance Overview</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Accuracy Chart */}
                                        <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                                            <div className="relative w-48 h-48 flex items-center justify-center mb-4">
                                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="45"
                                                        fill="none"
                                                        stroke="#e5e7eb"
                                                        strokeWidth="8"
                                                    />
                                                    {stats.total_questions_answered > 0 && (
                                                        <circle
                                                            cx="50"
                                                            cy="50"
                                                            r="45"
                                                            fill="none"
                                                            stroke="url(#gradient)"
                                                            strokeWidth="8"
                                                            strokeDasharray={`${(stats.total_correct_answers / stats.total_questions_answered) * 282.744} 282.744`}
                                                            strokeLinecap="round"
                                                            transform="rotate(-90 50 50)"
                                                        />
                                                    )}
                                                    <defs>
                                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor="#10b981" />
                                                            <stop offset="100%" stopColor="#059669" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                                <div className="absolute flex flex-col items-center justify-center">
                                                    <p className="text-3xl font-bold text-gray-800">
                                                        {stats.total_questions_answered > 0 ?
                                                            ((stats.total_correct_answers / stats.total_questions_answered) * 100).toFixed(1) :
                                                            '0'
                                                        }%
                                                    </p>
                                                    <p className="text-sm text-gray-600">Accuracy</p>
                                                </div>
                                            </div>
                                            <p className="text-center text-gray-600">
                                                {stats.total_correct_answers} correct out of {stats.total_questions_answered} total
                                            </p>
                                        </div>

                                        {/* Statistics */}
                                        <div className="flex flex-col justify-center space-y-4">
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-gray-700 font-semibold">Correct Answers</span>
                                                    <span className="text-green-600 font-bold text-lg">{stats.total_correct_answers}</span>
                                                </div>
                                                <div className="w-full bg-gray-300 rounded-full h-2">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full transition-all"
                                                        style={{
                                                            width: stats.total_questions_answered > 0 ?
                                                                `${(stats.total_correct_answers / stats.total_questions_answered) * 100}%` :
                                                                '0%'
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-gray-700 font-semibold">Wrong Answers</span>
                                                    <span className="text-red-600 font-bold text-lg">{stats.total_wrong_answers}</span>
                                                </div>
                                                <div className="w-full bg-gray-300 rounded-full h-2">
                                                    <div
                                                        className="bg-red-500 h-2 rounded-full transition-all"
                                                        style={{
                                                            width: stats.total_questions_answered > 0 ?
                                                                `${(stats.total_wrong_answers / stats.total_questions_answered) * 100}%` :
                                                                '0%'
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-gray-700 font-semibold">Average Score</span>
                                                    <span className="text-blue-600 font-bold text-lg">{stats.average_score ? stats.average_score.toFixed(2) : '0'}%</span>
                                                </div>
                                                <div className="w-full bg-gray-300 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full transition-all"
                                                        style={{
                                                            width: stats.average_score ? `${Math.min(stats.average_score, 100)}%` : '0%'
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* No Data State */}
                            {(!recentAttempts || recentAttempts.length === 0) && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400 mb-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Quiz Attempts Yet</h3>
                                    <p className="text-gray-600 mb-4">Start by creating and taking a quiz to see your statistics here.</p>
                                    <a href="/quiz/form" className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                                        Take a Quiz
                                    </a>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
