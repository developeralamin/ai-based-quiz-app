import React from 'react';
import { Link } from '@inertiajs/react';
import {
  SparklesIcon,
  BookOpenIcon,
  ChartBarIcon,
  GlobeAltIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

const Homepage = () => {
  const features = [
    {
      icon: SparklesIcon,
      title: '🤖 AI-Powered Quiz Generation',
      description: 'Automatically generate multiple-choice and true/false questions from any text using Google Gemini API',
      highlights: ['Instant generation', '1-50 questions', '3 difficulty levels']
    },
    {
      icon: BookOpenIcon,
      title: '📚 Book Management',
      description: 'Upload and organize PDFs, add cover images, and use advanced PDF viewer with zoom and search',
      highlights: ['Max 100MB files', 'Full-text search', 'Advanced viewer']
    },
    {
      icon: ChartBarIcon,
      title: '📊 Analytics Dashboard',
      description: 'Comprehensive analytics from 0% to 100% tracking your progress with detailed insights',
      highlights: ['Complete metrics', 'Performance trends', 'Recommendations']
    },
    {
      icon: GlobeAltIcon,
      title: '🌐 Multi-Language Support',
      description: 'Support for 5 languages including auto-detection and smart title generation',
      highlights: ['Bengali (বাংলা)', 'English, Spanish, French, German', 'Auto-detection']
    },
    {
      icon: LightBulbIcon,
      title: '💡 Smart Features',
      description: 'Smart title generation, auto language detection, and adaptive learning paths',
      highlights: ['Context-aware titles', 'Language detection', 'Personalization']
    },
    {
      icon: CheckCircleIcon,
      title: '✅ Complete Ecosystem',
      description: 'Notes, calendar planning, question bank, AI chat, and comprehensive tracking',
      highlights: ['Study materials', 'Planning tools', 'AI assistant']
    }
  ];

  const techStack = [
    { name: 'Laravel 11', category: 'Backend' },
    { name: 'React 18', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Styling' },
    { name: 'MySQL', category: 'Database' },
    { name: 'Google Gemini API', category: 'AI' },
    { name: 'Vite 6.4', category: 'Build' },
    { name: 'Inertia.js', category: 'Framework' },
    { name: 'PDF.js', category: 'PDF' }
  ];

  const analyticsMetrics = [
    { label: 'Total Quizzes', value: '25', icon: '📊' },
    { label: 'Average Score', value: '78.5%', icon: '🎯' },
    { label: 'Accuracy', value: '82.3%', icon: '✅' },
    { label: 'Study Time', value: '12h 45m', icon: '⏱️' }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen text-white">
      {/* Navigation Bar */}
      <nav className="bg-black/40 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Quiz App
            </span>
          </div>
          <div className="flex gap-4">
            <Link href="/register" className="px-4 py-2 text-purple-300 hover:text-purple-100 transition">
              Register
            </Link>
            <Link href="/login" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
            Transform Learning with AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Automatically generate quizzes from any text, track comprehensive analytics (0-100%),
            and personalize your learning with AI-powered insights.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/register"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold text-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
          >
            Get Started <ArrowRightIcon className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-lg font-semibold text-lg transition border border-purple-400/50"
          >
            Login to Dashboard
          </Link>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {analyticsMetrics.map((metric, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-sm border border-purple-400/20 rounded-lg p-6 hover:border-purple-400/50 transition">
              <div className="text-3xl mb-2">{metric.icon}</div>
              <div className="text-2xl font-bold text-purple-300">{metric.value}</div>
              <div className="text-sm text-gray-400">{metric.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-gray-400 text-lg">Everything you need for intelligent learning</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm border border-purple-400/20 hover:border-purple-400/50 rounded-lg p-8 transition transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
              >
                <Icon className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300 mb-6">{feature.description}</p>
                <div className="space-y-2">
                  {feature.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircleIcon className="w-4 h-4 text-green-400" />
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Analytics Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-purple-900/60 to-pink-900/60 backdrop-blur-md border border-purple-400/30 rounded-2xl p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Advanced Analytics Dashboard</h2>
              <p className="text-gray-300 text-lg mb-8">
                Track your learning progress with comprehensive analytics displaying metrics from 0% to 100%.
                Get insights on topic performance, weak areas, learning trends, and personalized recommendations.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <ChartBarIcon className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Complete Metrics</h4>
                    <p className="text-gray-400">Total quizzes, average scores, accuracy, and study time</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <SparklesIcon className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Smart Insights</h4>
                    <p className="text-gray-400">Topic performance, difficulty analysis, and weak areas</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <StarIcon className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Recommendations</h4>
                    <p className="text-gray-400">Personalized study suggestions and learning paths</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/40 border border-purple-400/20 rounded-xl p-8">
              <div className="space-y-6">
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Physics</span>
                    <span className="text-green-400 font-semibold">85%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Chemistry</span>
                    <span className="text-yellow-400 font-semibold">72%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Biology</span>
                    <span className="text-green-400 font-semibold">91%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full" style={{ width: '91%' }}></div>
                  </div>
                </div>
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Mathematics</span>
                    <span className="text-blue-400 font-semibold">78%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Language Support */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🌐 Multi-Language Support</h2>
          <p className="text-gray-400 text-lg">Create quizzes in your preferred language with auto-detection</p>
        </div>

        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {[
            { lang: 'Bengali', code: 'বাংলা', flag: '🇧🇩', featured: true },
            { lang: 'English', code: 'EN', flag: '🇬🇧', featured: false },
            { lang: 'Spanish', code: 'ES', flag: '🇪🇸', featured: false },
            { lang: 'French', code: 'FR', flag: '🇫🇷', featured: false },
            { lang: 'German', code: 'DE', flag: '🇩🇪', featured: false }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`${
                item.featured
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-purple-300'
                  : 'bg-purple-900/40 border border-purple-400/30'
              } rounded-lg p-6 text-center hover:scale-105 transition transform`}
            >
              <div className="text-4xl mb-2">{item.flag}</div>
              <div className="font-semibold mb-2">{item.lang}</div>
              <div className="text-sm text-gray-300">{item.code}</div>
              {item.featured && <div className="text-xs mt-2 text-purple-200">✨ Auto-detected</div>}
            </div>
          ))}
        </div>

        <div className="bg-black/40 border border-purple-400/20 rounded-lg p-8">
          <h3 className="text-lg font-semibold mb-4">Smart Auto-Detection</h3>
          <p className="text-gray-300 mb-6">
            The system automatically detects the language of your input content. If it contains Bengali characters (10%),
            Bengali will be auto-selected. You can always override the language selection before generating your quiz.
          </p>
          <div className="bg-purple-900/30 border-l-4 border-purple-400 rounded p-4">
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-purple-300">Example:</span> Input Bengali text →
              Auto-selects বাংলা → Quiz generates in Bengali language
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🛠️ Modern Tech Stack</h2>
          <p className="text-gray-400 text-lg">Built with cutting-edge technologies</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {techStack.map((tech, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-400/20 hover:border-purple-400/50 rounded-lg p-6 text-center transition hover:scale-105"
            >
              <div className="text-sm text-purple-300 font-semibold mb-2">{tech.category}</div>
              <div className="text-lg font-bold">{tech.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Start */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-purple-900/60 to-pink-900/60 backdrop-blur-md border border-purple-400/30 rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-8">⚡ Quick Start</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-purple-600 text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Create an Account</h3>
                  <p className="text-gray-400">Register with your email and start learning</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-purple-600 text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Upload Content</h3>
                  <p className="text-gray-400">Add text, PDF, or select from your book library</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-purple-600 text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Generate Quiz</h3>
                  <p className="text-gray-400">AI generates questions instantly in your language</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-purple-600 text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Track Progress</h3>
                  <p className="text-gray-400">View analytics and improve with recommendations</p>
                </div>
              </div>
            </div>

            <div className="bg-black/40 border border-purple-400/20 rounded-lg p-8">
              <h3 className="font-semibold mb-4">System Requirements</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span>PHP 8.2 or higher</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span>Node.js 16+</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span>MySQL 10.4+</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span>Modern web browser</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span>Internet connection</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-purple-400 mb-2">2.0.0</div>
            <div className="text-gray-400">Current Version</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-pink-400 mb-2">5</div>
            <div className="text-gray-400">Languages Supported</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-400 mb-2">10+</div>
            <div className="text-gray-400">Major Features</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">MIT</div>
            <div className="text-gray-400">Open Source License</div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-lg mb-8 text-purple-100">
            Join thousands of students using AI-powered learning
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition transform hover:scale-105"
          >
            Get Started Free <ArrowRightIcon className="w-5 h-5 inline ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/60 border-t border-purple-500/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">About</h3>
              <p className="text-gray-400">
                AI-Based Quiz Application - An intelligent learning platform powered by Google Gemini AI
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/register" className="hover:text-purple-300 transition">Register</a></li>
                <li><a href="/login" className="hover:text-purple-300 transition">Login</a></li>
                <li><a href="#" className="hover:text-purple-300 transition">Documentation</a></li>
                <li><a href="#" className="hover:text-purple-300 transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Technology</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Laravel 11</li>
                <li>React 18</li>
                <li>Google Gemini API</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-purple-500/20 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI-Based Quiz Application. All rights reserved. | MIT License</p>
            <p className="mt-2">Version 2.0.0 | Powered by Google Gemini AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
