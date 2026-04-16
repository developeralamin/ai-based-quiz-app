# 📚 AI-Based Quiz Application - Complete Documentation

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-Active-brightgreen.svg)

**An Intelligent Learning Management System Powered by AI**

*Transform educational content into interactive quizzes, manage your study materials, and track your learning progress.*

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Requirements](#system-requirements)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Routes & Endpoints](#api-routes--endpoints)
- [Core Features Guide](#core-features-guide)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Overview

The **AI-Based Quiz Application** is a sophisticated educational platform that leverages Google's Gemini API to automatically generate quiz questions from any text content. It provides a complete learning ecosystem with features for quiz generation, study material management, progress tracking, and collaborative learning.

**Primary Purpose:**
- Automatically generate quiz questions from educational text
- Manage and organize digital study materials (PDFs)
- Track learning progress and quiz performance
- Create an interactive study environment

---

## ✨ Key Features

### 1. **🤖 AI-Powered Quiz Generation**
- Automatically generate multiple-choice and true/false questions
- Powered by Google Gemini 3-Flash API
- Customizable number of questions
- Multi-language support
- Instant quiz creation from any text

### 2. **📚 Book Management System**
- Upload and organize PDF study materials
- Add cover images for better organization
- Full-text searchable library
- User-specific book collections
- PDF viewer with zoom and download features

### 3. **📊 Quiz Management**
- Generate quizzes from text
- Submit quiz responses and get instant feedback
- Store quiz results in database
- View detailed quiz statistics
- Track correct/incorrect answers

### 4. **📝 Notes System**
- Create and organize study notes
- Link notes to specific quizzes/topics
- Rich text editing capabilities
- Persistent storage of notes

### 5. **📅 Study Calendar**
- Schedule study sessions
- Set learning goals and milestones
- Track study streaks
- Visual calendar interface

### 6. **🔍 Question Bank**
- Repository of all generated questions
- Filter by topic/difficulty
- Reuse questions for practice
- Performance analytics per question

### 7. **💬 AI Chat Assistant**
- Interactive AI-powered tutoring
- Real-time responses to learning questions
- Contextual help based on quiz content
- Conversation history tracking

### 8. **📈 Learning Analytics & History**
- Track learning progress over time
- View performance metrics
- Quiz attempt history
- Success rate statistics
- Detailed performance breakdowns

### 9. **⚙️ User Settings & Profile**
- Customize learning preferences
- Manage notification settings
- Update profile information
- Privacy controls

---

## 🛠️ Tech Stack

### **Backend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Laravel** | 11.x | Web Framework |
| **PHP** | 8.2+ | Server Language |
| **MySQL/MariaDB** | 10.4+ | Database |
| **Google Gemini API** | 3-Flash | AI Question Generation |

### **Frontend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.2.0 | UI Framework |
| **Inertia.js** | 2.0.0 | Server-Driven UI |
| **Tailwind CSS** | 3.2.1 | Styling |
| **Vite** | 6.4.1 | Build Tool |
| **Heroicons** | 2.2.0 | Icon Library |

### **Additional Tools**
- **Composer** - PHP Dependency Manager
- **NPM** - JavaScript Package Manager
- **Pest/PHPUnit** - Testing Framework
- **Inertia.js** - SPA without building APIs

---

## 📋 System Requirements

### **Minimum Requirements**
- PHP >= 8.2
- Node.js >= 16.0
- NPM >= 8.0
- MySQL/MariaDB >= 10.4
- Composer >= 2.0

### **Server Requirements**
- 2 GB RAM minimum
- 2+ CPU cores
- 1 GB disk space
- Internet connection (for Gemini API)

### **Browser Support**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🚀 Installation & Setup

### **Step 1: Clone Repository**
```bash
git clone https://github.com/developeralamin/ai-based-quiz-app.git
cd ai-based-quiz-app
```

### **Step 2: Install PHP Dependencies**
```bash
composer install
```

### **Step 3: Setup Environment File**
```bash
cp .env.example .env
```

### **Step 4: Configure Gemini API Key**
Edit `.env` file and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_api_key_here
APP_NAME="AI Quiz App"
APP_URL=http://127.0.0.1:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ai_quiz_app
DB_USERNAME=root
DB_PASSWORD=
```

### **Step 5: Generate Application Key**
```bash
php artisan key:generate
```

### **Step 6: Create Database**
```sql
CREATE DATABASE ai_quiz_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### **Step 7: Run Migrations**
```bash
php artisan migrate
```

### **Step 8: Create Storage Symlink**
```bash
php artisan storage:link
```

### **Step 9: Install Node Dependencies**
```bash
npm install
```

### **Step 10: Build Frontend Assets**
```bash
npm run build
```

### **Step 11: Start Development Server**
```bash
php artisan serve
```

### **Step 12: Start Vite Development Server** (in another terminal)
```bash
npm run dev
```

### **Step 13: Access Application**
- Visit: `http://127.0.0.1:8000`
- Register a new account
- Login and start creating quizzes!

---

## 📁 Project Structure

```
ai-based-quiz-app/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── QuizController.php          # Quiz generation & management
│   │   │   ├── BooksController.php         # PDF book management
│   │   │   ├── NotesController.php         # Study notes management
│   │   │   ├── HistoryController.php       # Learning history
│   │   │   ├── AiChatController.php        # AI chat assistant
│   │   │   ├── ProfileController.php       # User profile
│   │   │   ├── SettingsController.php      # Application settings
│   │   │   └── [Other Controllers]
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Models/
│   │   ├── User.php                        # User authentication
│   │   ├── AIQuiz.php                      # Quiz model
│   │   ├── QuizResult.php                  # Quiz attempt results
│   │   ├── Book.php                        # Book/PDF model
│   │   └── [Other Models]
│   ├── Policies/
│   │   └── BookPolicy.php                  # Authorization policies
│   └── Providers/
│       ├── AppServiceProvider.php
│       └── RouteServiceProvider.php
├── database/
│   ├── migrations/
│   │   ├── create_users_table.php
│   │   ├── create_a_i_quizzes_table.php
│   │   ├── create_quiz_results_table.php
│   │   └── create_books_table.php
│   ├── factories/
│   │   └── UserFactory.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       └── BookSeeder.php
├── resources/
│   ├── js/
│   │   ├── Pages/
│   │   │   ├── Quiz/
│   │   │   │   ├── Create.jsx              # Quiz form
│   │   │   │   └── Generate.jsx            # Quiz display
│   │   │   ├── Books/
│   │   │   │   ├── Index.jsx               # Book library
│   │   │   │   ├── Create.jsx              # Upload book form
│   │   │   │   ├── Show.jsx                # PDF viewer
│   │   │   │   └── Edit.jsx                # Edit book info
│   │   │   ├── Notes/
│   │   │   │   └── Index.jsx
│   │   │   ├── History/
│   │   │   │   └── Index.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── [Other Pages]
│   │   ├── Layouts/
│   │   │   ├── AuthenticatedLayout.jsx     # Main layout
│   │   │   └── GuestLayout.jsx
│   │   ├── Components/                     # Reusable components
│   │   ├── app.jsx                         # React entry point
│   │   └── bootstrap.js
│   ├── css/
│   │   └── app.css
│   └── views/
│       ├── app.blade.php                   # Blade layout
│       └── [Other views]
├── routes/
│   ├── web.php                             # Web routes
│   ├── auth.php                            # Auth routes
│   └── console.php
├── config/
│   ├── app.php
│   ├── database.php
│   ├── filesystems.php
│   └── [Other configs]
├── public/
│   ├── index.php                           # Entry point
│   └── storage/ (symlink)
├── storage/
│   ├── app/
│   │   ├── public/
│   │   │   └── books/                      # Uploaded PDFs
│   │   └── private/
│   └── logs/
├── tests/
│   ├── Feature/
│   └── Unit/
├── .env.example
├── composer.json
├── package.json
├── vite.config.js
├── tailwind.config.js
├── phpunit.xml
└── README.md
```

---

## 🗄️ Database Schema

### **Users Table**
```
id (bigint, PK)
name (string)
email (string, unique)
email_verified_at (timestamp, nullable)
password (string, hashed)
remember_token (string, nullable)
created_at (timestamp)
updated_at (timestamp)
```

### **AI Quizzes Table**
```
id (bigint, PK)
user_id (bigint, FK → users)
topic (string)
text_content (longtext)
language (string)
num_questions (int)
questions (longtext, JSON)
created_at (timestamp)
updated_at (timestamp)
```

### **Quiz Results Table**
```
id (bigint, PK)
user_id (bigint, FK → users)
quiz_id (bigint, FK → ai_quizzes)
answers (longtext, JSON)
correct_count (int)
total_count (int)
percentage (float)
created_at (timestamp)
updated_at (timestamp)
```

### **Books Table**
```
id (bigint, PK)
user_id (bigint, FK → users)
title (string)
author (string)
description (text, nullable)
file_path (string)
cover_image (string, nullable)
created_at (timestamp)
updated_at (timestamp)
INDEX (user_id)
FULLTEXT (title, author, description)
```

---

## 🛣️ API Routes & Endpoints

### **Authentication Routes**
```
POST   /register                Register new user
POST   /login                   User login
POST   /logout                  User logout
POST   /forgot-password         Request password reset
POST   /reset-password          Reset password
```

### **Quiz Routes**
```
GET    /quiz/form               Show quiz generation form
POST   /quiz/generate           Generate quiz from text
POST   /quiz/submit-result      Submit quiz answers
GET    /history                 View quiz history
```

### **Book Management Routes**
```
GET    /books                   List all user books
POST   /books                   Upload new book (multipart/form-data)
GET    /books/create            Show upload form
GET    /books/{id}              View/read PDF
GET    /books/{id}/edit         Show edit form
PATCH  /books/{id}              Update book metadata
DELETE /books/{id}              Delete book
```

### **Notes Routes**
```
GET    /notes                   List all notes
POST   /notes                   Create new note
PATCH  /notes/{id}              Update note
DELETE /notes/{id}              Delete note
```

### **AI Chat Routes**
```
GET    /ai-chat                 Chat interface
GET    /ai-chat/details/{id}    Chat history details
POST   /ai-chat/message         Send message to AI
```

### **Other Routes**
```
GET    /dashboard               User dashboard
GET    /profile                 User profile
PATCH  /profile                 Update profile
DELETE /profile                 Delete account
GET    /settings                App settings
GET    /question-bank           All questions repository
GET    /study-calendar          Study schedule
GET    /ai-tools                AI utilities page
```

---

## 📚 Core Features Guide

### **1. AI Quiz Generation**

#### **How It Works:**
1. User navigates to `/quiz/form`
2. Enters text content (book excerpt, article, notes)
3. Specifies number of questions (optional)
4. Selects language for questions (optional)
5. System sends request to Google Gemini API
6. API generates multiple-choice and true/false questions
7. Questions displayed with interactive answer options
8. User submits answers and receives instant feedback

#### **Technical Details:**
- **API Used:** Google Gemini 3-Flash Model
- **Request Type:** JSON POST
- **Question Types:** Multiple-choice, True/False
- **Processing:** Real-time response from Gemini API
- **Database Storage:** Full quiz stored as JSON
- **Maximum Characters:** No hard limit (API dependent)

#### **Usage Example:**
```
Input Text: "The Earth revolves around the Sun..."
Num Questions: 5
Language: English

Output:
[
  {
    "type": "multiple-choice",
    "question": "What does the Earth orbit?",
    "options": ["A) Moon", "B) Sun", "C) Venus", "D) Mars"],
    "answer": "B",
    "question_no": 1
  },
  {
    "type": "true-false",
    "question": "The Earth is flat.",
    "answer": "False",
    "question_no": 2
  }
]
```

---

### **2. Book Management (PDF Upload & Viewing)**

#### **Features:**
- ✅ Upload PDF files (max 100MB)
- ✅ Add optional cover images (max 5MB)
- ✅ Full-text search (title, author, description)
- ✅ User-specific libraries
- ✅ Advanced PDF viewer with zoom and download
- ✅ Edit book metadata anytime
- ✅ Delete books and associated files

#### **File Structure:**
```
storage/app/public/books/
├── pdfs/
│   ├── 2024_04_16_110000_quantum_physics.pdf
│   ├── 2024_04_16_120000_chemistry_guide.pdf
│   └── [other PDFs]
└── covers/
    ├── 2024_04_16_110000_quantum_physics.jpg
    ├── 2024_04_16_120000_chemistry_guide.jpg
    └── [other covers]
```

#### **Database Storage:**
```
Book {
  id: 1,
  user_id: 1,
  title: "Quantum Physics Fundamentals",
  author: "John Smith",
  description: "A comprehensive guide...",
  file_path: "books/pdfs/2024_04_16_110000_quantum_physics.pdf",
  cover_image: "books/covers/2024_04_16_110000_quantum_physics.jpg",
  created_at: "2024-04-16 11:00:00"
}
```

#### **PDF Viewer Features:**
- Embedded viewer with native controls
- Zoom: 50% to 200%
- Print functionality
- Download original PDF
- Page navigation
- Text search within PDF
- Responsive design

---

### **3. Quiz Results & Performance Tracking**

#### **Result Storage:**
```
QuizResult {
  id: 1,
  user_id: 1,
  quiz_id: 1,
  answers: {
    "q1": "B",
    "q2": "True",
    "q3": "A"
  },
  correct_count: 2,
  total_count: 3,
  percentage: 66.67,
  created_at: "2024-04-16 11:30:00"
}
```

#### **Performance Metrics:**
- Total quizzes attempted
- Average score
- Success rate (percentage of passing quizzes)
- Time tracked per quiz
- Question-wise performance
- Topic-wise statistics

---

### **4. Study Notes System**

#### **Features:**
- Create and organize notes
- Link to specific quizzes
- Rich text editing
- Tag/category support
- Search functionality
- Version history

---

### **5. Study Calendar**

#### **Features:**
- Visual calendar interface
- Schedule study sessions
- Set reminders for important dates
- Track study streaks
- Goal management
- Weekly/Monthly view

---

### **6. Question Bank**

#### **Purpose:**
- Repository of all generated questions
- Filter by topic, difficulty, date
- Reuse questions for practice
- Performance analytics per question
- Export questions for offline study

---

### **7. AI Chat Assistant**

#### **Features:**
- Real-time conversational AI
- Context-aware responses
- Learning support
- Question answering
- Concept explanation
- Conversation history

#### **Integration:**
- Built on Gemini API
- Maintains conversation context
- Provides educational assistance
- Personalized learning support

---

## ⚙️ Configuration

### **Environment Variables (.env)**
```env
# Application
APP_NAME="AI Quiz App"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ai_quiz_app
DB_USERNAME=root
DB_PASSWORD=

# API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=465
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@example.com

# File Storage
FILESYSTEM_DISK=public

# Session
SESSION_LIFETIME=120
SESSION_DRIVER=cookie

# Cache
CACHE_DRIVER=file
```

### **Gemini API Setup**

1. **Get API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create new API key
   - Copy the key

2. **Add to .env:**
   ```
   GEMINI_API_KEY=AIza...
   ```

3. **Alternative Keys** (for backup):
   ```
   GEMINI_API_KEY=AIzaSyAhlamlKez25eKEshI3oNsIyH1ItMm1PuU
   GEMINI_API_KEY=AIzaSyD_mMcPqu0qEspk8BKoUcalix7o09Dt4Uw
   ```

### **Tailwind Configuration**
- Configured in `tailwind.config.js`
- Dark mode support available
- Custom colors defined
- Responsive breakpoints configured

### **Vite Configuration**
- Asset bundling optimized
- HMR enabled for development
- Production optimization enabled
- React plugin active

---

## 🔧 Troubleshooting

### **Common Issues & Solutions**

#### **1. "DocumentDownloadIcon not found" Error**
**Solution:**
- Replace with `ArrowDownTrayIcon` from @heroicons/react
- Already fixed in current version

#### **2. Database Connection Error**
```
Error: SQLSTATE[HY000] [2002] Connection refused
```
**Solution:**
- Check MySQL is running
- Verify DB credentials in .env
- Ensure database exists: `CREATE DATABASE ai_quiz_app;`

#### **3. Storage Symlink Error**
```
Error: File not found in storage
```
**Solution:**
```bash
php artisan storage:link
```

#### **4. PDF Upload Fails**
**Solution:**
- Check file size (max 100MB)
- Verify `storage/app/public/books/` directory exists
- Check file permissions: `chmod -R 775 storage/`

#### **5. Gemini API Error**
```
Error: API request failed
```
**Solution:**
- Verify API key in .env
- Check internet connection
- Ensure API quota not exceeded
- Try alternative API key

#### **6. "route() function not found" Error**
**Solution:**
- Use direct paths instead: `/books/create`
- Already configured in current components

#### **7. CSRF Token Mismatch**
**Solution:**
```bash
php artisan cache:clear
php artisan config:clear
```

#### **8. Node Modules Issue**
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### **9. Permission Denied on Migration**
**Solution:**
```bash
php artisan migrate:refresh
chmod -R 777 database/
```

#### **10. Vite Hot Module Replacement (HMR) Issue**
**Solution:**
- Kill and restart Vite dev server
```bash
npm run dev
```

---

## 🧪 Testing

### **Run Tests**
```bash
# Run all tests
php artisan test

# Run specific test
php artisan test tests/Feature/QuizTest.php

# Run with coverage
php artisan test --coverage
```

### **Test Files Location**
```
tests/
├── Feature/
│   ├── QuizTest.php
│   └── BooksTest.php
└── Unit/
    └── BookModelTest.php
```

---

## 📊 Performance Optimization

### **Database Optimization**
- Indexes added on foreign keys
- Full-text search configured for books
- Query optimization for quiz history
- Connection pooling recommended

### **Frontend Optimization**
- Asset minification via Vite
- CSS tree-shaking enabled
- Code splitting configured
- Image optimization recommended

### **Caching Strategy**
- Query result caching
- Route caching for production
- View caching enabled
- Configuration caching

### **Production Deployment**
```bash
# Build for production
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Start production server
php artisan serve --host=0.0.0.0 --port=8000
```

---

## 🔐 Security Features

✅ **Authentication**
- User registration and login
- Email verification
- Password reset functionality
- Session management

✅ **Authorization**
- User-specific data access
- Book ownership validation
- Quiz result isolation
- Role-based access control

✅ **Data Protection**
- CSRF protection on all forms
- SQL injection prevention (Eloquent ORM)
- XSS protection
- Secure password hashing (bcrypt)

✅ **File Security**
- File type validation
- File size limits
- Secure storage outside public directory
- Access control on file downloads

✅ **API Security**
- Rate limiting (can be configured)
- Input validation
- Request sanitization
- Error handling without exposing details

---

## 📈 Analytics & Monitoring

### **Tracked Metrics:**
- Quiz generation requests
- Average quiz scores
- Learning progress per user
- Book upload statistics
- Study session duration
- Question difficulty analysis

### **Reports Available:**
- User performance reports
- Quiz statistics
- Learning progress charts
- Activity logs
- System health status

---

## 🚀 Deployment Guide

### **Deployment Steps:**

1. **Choose Hosting:** Heroku, DigitalOcean, AWS, or traditional shared hosting

2. **Server Requirements:**
   - PHP 8.2+
   - MySQL 10.4+
   - Node.js 16+
   - Composer
   - Git

3. **Deploy Process:**
```bash
# Clone repository
git clone repo-url
cd ai-based-quiz-app

# Install dependencies
composer install --optimize-autoloader --no-dev
npm install

# Configure environment
cp .env.example .env
# Edit .env with production values

# Generate key
php artisan key:generate

# Database setup
php artisan migrate --force

# Build assets
npm run build

# Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create storage symlink
php artisan storage:link
```

---

## 📞 Support & Contact

### **Getting Help:**
- Check [Troubleshooting](#troubleshooting) section
- Review error messages carefully
- Check application logs: `storage/logs/laravel.log`
- Search GitHub issues: [Repository Issues](https://github.com/developeralamin/ai-based-quiz-app/issues)

### **Report Bugs:**
1. Describe the issue clearly
2. Provide steps to reproduce
3. Share error messages
4. Include system information

### **Feature Requests:**
- Open GitHub discussion
- Describe use case
- Suggest implementation approach
- Link relevant documentation

---

## 📜 License & Attribution

- **License:** MIT License
- **Author:** Alamin (developeralamin)
- **AI Model:** Google Gemini 3-Flash API
- **Framework:** Laravel 11
- **Frontend:** React 18 + Inertia.js

---

## 🙏 Acknowledgments

- **Laravel Community** - For the amazing framework
- **Google AI** - For Gemini API
- **React Community** - For React ecosystem
- **Tailwind Labs** - For Tailwind CSS
- **All Contributors** - For continuous improvements

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2024-04-16 | Added Book Management & PDF Viewing |
| 1.0.0 | 2024-03-12 | Initial Release - Quiz Generation |

---

<div align="center">

### ⭐ If you find this project helpful, please give it a star!

**Made with ❤️ by Alamin**

[Visit Repository](https://github.com/developeralamin/ai-based-quiz-app)

</div>

---

## 🗺️ Future Enhancements

- [ ] Real-time collaborative quizzes
- [ ] Advanced analytics dashboard
- [ ] Mobile native apps (iOS/Android)
- [ ] Offline mode support
- [ ] Integration with LMS platforms
- [ ] Advanced question types
- [ ] Gamification features
- [ ] Social learning features
- [ ] API for third-party integrations
- [ ] Multi-language support expansion

---

**Last Updated:** April 16, 2026
**Documentation Version:** 1.0.0
