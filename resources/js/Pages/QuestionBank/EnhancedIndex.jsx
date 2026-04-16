import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
  LightBulbIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  StarIcon,
  TrashIcon,
  PencilIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

const QuestionCard = ({ question, onDelete, onEdit }) => {
  const getDifficultyColor = (level) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type) => {
    const colors = {
      mcq: 'bg-blue-100 text-blue-800',
      'true-false': 'bg-purple-100 text-purple-800',
      'short-answer': 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const successRate = question.total_attempts ? ((question.correct_attempts / question.total_attempts) * 100).toFixed(0) : 0;

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{question.question_text}</h3>
          {question.topic && (
            <p className="text-sm text-gray-600 mt-2">📌 {question.topic}</p>
          )}
        </div>
        <StarIcon className={`w-5 h-5 flex-shrink-0 ${question.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty_level)}`}>
          {question.difficulty_level}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(question.question_type)}`}>
          {question.question_type.replace('-', ' ').toUpperCase()}
        </span>
        {question.correct_attempts > 0 && (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircleIcon className="w-3 h-3" />
            {successRate}% success rate
          </span>
        )}
      </div>

      {question.explanation && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Explanation:</strong> {question.explanation.substring(0, 100)}...
          </p>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b">
        <span>Used in {question.quiz_count || 0} quizzes</span>
        <span>{question.total_attempts} attempts</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(question.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
        >
          <PencilIcon className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete(question.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
        >
          <TrashIcon className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default function QuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterTopic, setFilterTopic] = useState('all');
  const [topics, setTopics] = useState([]);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    favoriteQuestions: 0,
    mostUsedTopic: '',
    averageSuccessRate: 0
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [searchTerm, filterDifficulty, filterType, filterTopic, questions]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/question-bank', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        const fetchedQuestions = data.questions || data.data?.questions || [];
        processQuestions(fetchedQuestions);
      } else {
        // Use sample data if API fails
        processQuestions(getSampleQuestions());
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Use sample data on error
      processQuestions(getSampleQuestions());
    }
  };

  const getSampleQuestions = () => {
    // Simulating API response with sample data
    return [
        {
          id: 1,
          question_text: 'What is the capital of France?',
          difficulty_level: 'easy',
          question_type: 'mcq',
          topic: 'Geography',
          explanation: 'Paris is the capital and most populous city of France.',
          correct_attempts: 45,
          total_attempts: 50,
          quiz_count: 12,
          is_favorite: false
        },
        {
          id: 2,
          question_text: 'Is photosynthesis an endothermic process?',
          difficulty_level: 'medium',
          question_type: 'true-false',
          topic: 'Biology',
          explanation: 'Yes, photosynthesis is an endothermic process as it requires energy from sunlight.',
          correct_attempts: 35,
          total_attempts: 50,
          quiz_count: 8,
          is_favorite: true
        },
        {
          id: 3,
          question_text: 'Solve: 2x² + 5x + 3 = 0',
          difficulty_level: 'hard',
          question_type: 'short-answer',
          topic: 'Mathematics',
          explanation: 'Using the quadratic formula: x = (-5 ± √(25-24))/4 = (-5 ± 1)/4',
          correct_attempts: 20,
          total_attempts: 50,
          quiz_count: 15,
          is_favorite: false
        }
      ];
  };

  const processQuestions = (sampleQuestions) => {
    try {
      setQuestions(sampleQuestions);

      // Extract unique topics
      const uniqueTopics = [...new Set(sampleQuestions.map(q => q.topic).filter(Boolean))];
      setTopics(uniqueTopics);

      // Calculate stats
      const totalCorrect = sampleQuestions.reduce((sum, q) => sum + q.correct_attempts, 0);
      const totalAttempts = sampleQuestions.reduce((sum, q) => sum + q.total_attempts, 0);
      const avgSuccess = totalAttempts ? ((totalCorrect / totalAttempts) * 100).toFixed(0) : 0;

      setStats({
        totalQuestions: sampleQuestions.length,
        favoriteQuestions: sampleQuestions.filter(q => q.is_favorite).length,
        mostUsedTopic: uniqueTopics[0] || 'N/A',
        averageSuccessRate: avgSuccess
      });
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = [...questions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(q =>
        q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.topic && q.topic.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Difficulty filter
    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty_level === filterDifficulty);
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(q => q.question_type === filterType);
    }

    // Topic filter
    if (filterTopic !== 'all') {
      filtered = filtered.filter(q => q.topic === filterTopic);
    }

    setFilteredQuestions(filtered);
  };

  const handleDelete = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter(q => q.id !== questionId));
      console.log('Delete question:', questionId);
    }
  };

  const handleEdit = (questionId) => {
    console.log('Edit question:', questionId);
    // Navigate to edit page
  };

  return (
    <AuthenticatedLayout>
      <Head title="Question Bank" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <LightBulbIcon className="w-8 h-8 text-purple-600" />
            Question Bank
          </h1>
          <p className="text-gray-600 mt-2">Access and manage your reusable question collection</p>
        </div>
        <Link
          href="/question-bank/create"
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
        >
          <PlusIcon className="w-5 h-5" />
          Add Question
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-lg shadow p-6">
          <p className="text-sm opacity-90">Total Questions</p>
          <p className="text-3xl font-bold mt-2">{stats.totalQuestions}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg shadow p-6">
          <p className="text-sm opacity-90">Favorites</p>
          <p className="text-3xl font-bold mt-2">{stats.favoriteQuestions}</p>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-lg shadow p-6">
          <p className="text-sm opacity-90">Success Rate</p>
          <p className="text-3xl font-bold mt-2">{stats.averageSuccessRate}%</p>
        </div>
        <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-lg shadow p-6">
          <p className="text-sm opacity-90">Top Topic</p>
          <p className="text-3xl font-bold mt-2">{stats.mostUsedTopic}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MagnifyingGlassIcon className="w-4 h-4" />
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="mcq">MCQ</option>
              <option value="true-false">True/False</option>
              <option value="short-answer">Short Answer</option>
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
            <select
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
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

      {/* Questions Grid */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : filteredQuestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuestions.map(question => (
              <QuestionCard
                key={question.id}
                question={question}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <LightBulbIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No questions found matching your filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterDifficulty('all');
                setFilterType('all');
                setFilterTopic('all');
              }}
              className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-8 text-center text-sm text-gray-600">
        Showing {filteredQuestions.length} of {questions.length} questions
      </div>
    </AuthenticatedLayout>
  );
}
