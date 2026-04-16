import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
  ChartBarIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6 flex items-start gap-4`}>
      <div className={`p-3 rounded-lg ${color === 'blue' ? 'bg-blue-100' : color === 'purple' ? 'bg-purple-100' : color === 'green' ? 'bg-green-100' : 'bg-orange-100'}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    booksRead: 0,
    streakDays: 0,
    recentQuizzes: [],
    topicsPerformance: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data
    fetch('/analytics/stats', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setStats(data.data || data || {});
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stats:', err);
        setStats({});
        setLoading(false);
      });
  }, []);

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back! 👋</h1>
        <p className="text-gray-600 mt-2">Here's your learning overview</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={QuestionMarkCircleIcon}
          title="Total Quizzes"
          value={stats.totalQuizzes}
          subtitle="Completed this month"
          color="blue"
        />
        <StatCard
          icon={ArrowTrendingUpIcon}
          title="Average Score"
          value={`${stats.averageScore}%`}
          subtitle="Overall performance"
          color="purple"
        />
        <StatCard
          icon={BookOpenIcon}
          title="Books Read"
          value={stats.booksRead}
          subtitle="Reading progress"
          color="green"
        />
        <StatCard
          icon={FireIcon}
          title="Streak"
          value={stats.streakDays}
          subtitle="Days in a row"
          color="orange"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Quizzes */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Quizzes</h2>
            <Link href="/my-quizzes" className="text-purple-600 text-sm hover:text-purple-700">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : stats.recentQuizzes.length > 0 ? (
            <div className="space-y-3">
              {stats.recentQuizzes.map((quiz, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div>
                    <p className="font-medium text-gray-900">{quiz.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{quiz.date}</p>
                  </div>
                  <span className={`text-sm font-semibold ${quiz.score >= 75 ? 'text-green-600' : quiz.score >= 60 ? 'text-orange-600' : 'text-red-600'}`}>
                    {quiz.score}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <QuestionMarkCircleIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No quizzes taken yet</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/quiz/form"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:shadow-lg transition"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>Generate Quiz</span>
            </Link>
            <Link
              href="/books"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition"
            >
              <BookOpenIcon className="w-5 h-5" />
              <span>Browse Books</span>
            </Link>
            <Link
              href="/analytics"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg transition"
            >
              <ChartBarIcon className="w-5 h-5" />
              <span>View Analytics</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Performance by Topic */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance by Topic</h2>
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : stats.topicsPerformance.length > 0 ? (
          <div className="space-y-4">
            {stats.topicsPerformance.map((topic, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">{topic.name}</p>
                  <span className="text-sm font-semibold text-gray-600">{topic.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      topic.percentage >= 75 ? 'bg-green-500' : topic.percentage >= 60 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${topic.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No data available yet</p>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
