import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
  AdjustmentsHorizontalIcon,
  PlayIcon,
  LightBulbIcon,
  SparklesIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

const QuizCard = ({ quiz, onStart, onPreview }) => (
  <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <p className="text-xs text-gray-600">Questions</p>
          <p className="text-lg font-bold text-gray-900">{quiz.question_count}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600">Difficulty</p>
          <p className="text-lg font-bold capitalize">
            <span className={`${
              quiz.starting_difficulty === 'easy' ? 'text-green-600' :
              quiz.starting_difficulty === 'medium' ? 'text-orange-600' :
              'text-red-600'
            }`}>
              {quiz.starting_difficulty}
            </span>
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600">Time</p>
          <p className="text-lg font-bold text-gray-900">{quiz.duration_minutes}m</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onStart(quiz.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
        >
          <PlayIcon className="w-4 h-4" />
          Start Quiz
        </button>
        <button
          onClick={() => onPreview(quiz.id)}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          Preview
        </button>
      </div>
    </div>
  </div>
);

export default function AdaptiveQuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [topics, setTopics] = useState([]);
  const [stats, setStats] = useState({
    adaptiveQuizzesTaken: 0,
    averageScore: 0,
    improvedTopics: 0
  });

  useEffect(() => {
    fetchQuizzes();
    fetchStats();
  }, [selectedDifficulty, selectedTopic]);

  const fetchQuizzes = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);
      if (selectedTopic !== 'all') params.append('topic', selectedTopic);

      // For now, we'll fetch from API or use a list of available quizzes
      // This endpoint may not exist yet, so we'll default to empty list
      try {
        const response = await fetch(`/api/quizzes?${params}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          setQuizzes(data.quizzes || []);
          const uniqueTopics = [...new Set(data.quizzes?.map(q => q.topic).filter(Boolean) || [])];
          setTopics(uniqueTopics);
        } else {
          // If endpoint doesn't exist, set empty quizzes
          setQuizzes([]);
          setTopics([]);
        }
      } catch (error) {
        console.error('Error fetching quizzes from API:', error);
        // Fallback to empty quizzes
        setQuizzes([]);
        setTopics([]);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/analytics/dashboard', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        const responseData = data.data || data;
        setStats({
          adaptiveQuizzesTaken: responseData.adaptive_quizzes_taken || 0,
          averageScore: responseData.adaptive_average_score || 0,
          improvedTopics: responseData.improved_topics_count || 0
        });
      } else {
        // Set defaults on error
        setStats({
          adaptiveQuizzesTaken: 0,
          averageScore: 0,
          improvedTopics: 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        adaptiveQuizzesTaken: 0,
        averageScore: 0,
        improvedTopics: 0
      });
    }
  };

  const handleStartQuiz = async (quizId) => {
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

      if (!csrfToken) {
        console.error('CSRF token not found');
        alert('Error: Security token not found. Please refresh the page and try again.');
        return;
      }

      const response = await fetch('/adaptive-quiz/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify({
          quiz_id: quizId,
          starting_difficulty: 'medium'
        })
      });

      if (!response.ok) {
        let errorMessage = 'Failed to start quiz';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // Response is not JSON
        }
        console.error('Error starting quiz:', errorMessage);
        alert(`Error: ${errorMessage}`);
        return;
      }

      const data = await response.json();

      if (!data.success) {
        alert(`Error: ${data.error || 'Failed to start quiz'}`);
        return;
      }

      if (data.session_id) {
        // Redirect to adaptive quiz session page
        window.location.href = `/quiz/${data.session_id}`;
      } else if (data.quiz_id) {
        // Fallback to quiz display page
        window.location.href = `/quiz/${data.quiz_id}`;
      } else {
        console.error('No session or quiz ID in response:', data);
        alert('Error: Could not establish quiz session');
      }
    } catch (error) {
      console.error('Network error starting quiz:', error);
      alert(`Network error: ${error.message}`);
    }
  };

  const handlePreviewQuiz = (quizId) => {
    // Navigate to quiz show page for preview
    window.location.href = `/quiz/${quizId}`;
  };

  return (
    <AuthenticatedLayout>
      <Head title="Adaptive Quiz" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <AdjustmentsHorizontalIcon className="w-8 h-8 text-purple-600" />
          Adaptive Quiz Mode
        </h1>
        <p className="text-gray-600 mt-2">Intelligent quizzes that adjust difficulty based on your performance</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 flex items-start gap-4">
        <LightBulbIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900">How Adaptive Quizzes Work</h3>
          <p className="text-sm text-blue-800 mt-1">
            Our adaptive quiz system intelligently adjusts the difficulty of questions based on your answers. Start with a baseline difficulty and watch it increase or decrease based on your performance. This ensures you're always challenged at the right level for optimal learning.
          </p>
          <ul className="text-sm text-blue-800 mt-3 space-y-1 list-disc list-inside">
            <li>3 consecutive correct answers increase difficulty</li>
            <li>2 consecutive incorrect answers decrease difficulty</li>
            <li>Get instant feedback with explanations</li>
          </ul>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-lg shadow p-6">
          <p className="text-sm opacity-90 flex items-center gap-2">
            <SparklesIcon className="w-4 h-4" />
            Adaptive Quizzes Taken
          </p>
          <p className="text-3xl font-bold mt-2">{stats.adaptiveQuizzesTaken}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg shadow p-6">
          <p className="text-sm opacity-90 flex items-center gap-2">
            <ChartBarIcon className="w-4 h-4" />
            Average Score
          </p>
          <p className="text-3xl font-bold mt-2">{Math.round(stats.averageScore)}%</p>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-lg shadow p-6">
          <p className="text-sm opacity-90 flex items-center gap-2">
            <LightBulbIcon className="w-4 h-4" />
            Topics Improved
          </p>
          <p className="text-3xl font-bold mt-2">{stats.improvedTopics}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Starting Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="all">All Topics</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Available Adaptive Quizzes */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Quizzes</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map(quiz => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onStart={handleStartQuiz}
                onPreview={handlePreviewQuiz}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <ExclamationTriangleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No quizzes available matching your criteria</p>
            <button
              onClick={() => {
                setSelectedDifficulty('all');
                setSelectedTopic('all');
              }}
              className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AdjustmentsHorizontalIcon className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Smart Difficulty Adjustment</h3>
          <p className="text-sm text-gray-600">Questions automatically adjust based on your performance for optimal challenge level</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SparklesIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Instant Feedback</h3>
          <p className="text-sm text-gray-600">Get detailed explanations for each answer to enhance your understanding</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChartBarIcon className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Progress Tracking</h3>
          <p className="text-sm text-gray-600">Monitor your learning journey with detailed analytics and insights</p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
