import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  AcademicCapIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

const AnalyticsMetric = ({ label, value, unit, icon: Icon, trend, color = 'purple' }) => {
  const colorClasses = {
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {unit && <p className="text-xs text-gray-500 mt-1">{unit}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color === 'purple' ? 'bg-purple-100' : color === 'blue' ? 'bg-blue-100' : color === 'green' ? 'bg-green-100' : 'bg-orange-100'}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className={`text-xs mt-3 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
        </div>
      )}
    </div>
  );
};

const ChartPlaceholder = ({ title }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
    <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <ChartBarIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500">Chart loading...</p>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalQuizzes: 0,
      averageScore: 0,
      totalTime: 0,
      streakDays: 0
    },
    performance: {
      byTopic: [],
      byDifficulty: [],
      weakAreas: []
    },
    trends: {
      weekly: [],
      monthly: []
    },
    recommendations: []
  });

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // week, month, year

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/analytics/dashboard?range=${timeRange}`, {
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

      setAnalytics({
        overview: {
          totalQuizzes: responseData.overall_stats?.total_quizzes || 0,
          averageScore: responseData.overall_stats?.average_score || 0,
          totalTime: responseData.overall_stats?.total_time_minutes || 0,
          streakDays: 0
        },
        performance: {
          byTopic: responseData.top_topics || [],
          byDifficulty: responseData.by_difficulty || [],
          weakAreas: responseData.weak_areas || []
        },
        trends: {
          weekly: [],
          monthly: []
        },
        recommendations: responseData.recommendations || []
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Keep default values on error
      setAnalytics({
        overview: {
          totalQuizzes: 0,
          averageScore: 0,
          totalTime: 0,
          streakDays: 0
        },
        performance: {
          byTopic: [],
          byDifficulty: [],
          weakAreas: []
        },
        trends: {
          weekly: [],
          monthly: []
        },
        recommendations: []
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Analytics Dashboard" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your learning progress and performance</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsMetric
          label="Total Quizzes"
          value={analytics.overview.totalQuizzes}
          unit="quizzes completed"
          icon={AcademicCapIcon}
          trend={12}
          color="purple"
        />
        <AnalyticsMetric
          label="Average Score"
          value={`${Math.round(analytics.overview.averageScore)}%`}
          unit="overall performance"
          icon={ArrowTrendingUpIcon}
          trend={5}
          color="blue"
        />
        <AnalyticsMetric
          label="Total Study Time"
          value={Math.round(analytics.overview.totalTime / 60)}
          unit="hours"
          icon={CalendarIcon}
          trend={-2}
          color="green"
        />
        <AnalyticsMetric
          label="Current Streak"
          value={analytics.overview.streakDays}
          unit="days in a row"
          icon={SparklesIcon}
          color="orange"
        />
      </div>

      {/* Performance by Topic */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance by Topic</h2>
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        ) : analytics.performance.byTopic.length > 0 ? (
          <div className="space-y-6">
            {analytics.performance.byTopic.map((topic, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">{topic.name}</p>
                  <span className="text-sm font-semibold text-gray-600">{topic.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      topic.percentage >= 75 ? 'bg-green-500' : topic.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${topic.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{topic.quizzes} quizzes • {topic.correct}/{topic.total} correct</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No data available</p>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance by Difficulty */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance by Difficulty</h2>
          {analytics.performance.byDifficulty.length > 0 ? (
            <div className="space-y-4">
              {analytics.performance.byDifficulty.map((diff, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{diff.level}</p>
                    <p className="text-xs text-gray-500">{diff.quizzes} quizzes</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${diff.percentage >= 75 ? 'text-green-600' : 'text-orange-600'}`}>
                      {diff.percentage}%
                    </p>
                    <p className="text-xs text-gray-500">{diff.correct}/{diff.total}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No data available</p>
          )}
        </div>

        {/* Weak Areas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
            Areas to Improve
          </h2>
          {analytics.performance.weakAreas.length > 0 ? (
            <div className="space-y-3">
              {analytics.performance.weakAreas.map((area, idx) => (
                <div key={idx} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="font-medium text-gray-900">{area.topic}</p>
                  <p className="text-sm text-gray-600 mt-1">{area.reason}</p>
                  <button className="text-sm text-orange-600 hover:text-orange-700 mt-2 font-medium">
                    Practice Now →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Great job! No weak areas identified.</p>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartPlaceholder title="Learning Trends" />
        <ChartPlaceholder title="Quiz Distribution" />
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-purple-600" />
          Personalized Recommendations
        </h2>
        {analytics.recommendations.length > 0 ? (
          <div className="space-y-3">
            {analytics.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-600 text-white text-sm font-semibold">
                    {idx + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{rec.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">Complete more quizzes to get personalized recommendations</p>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
