import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
  SparklesIcon,
  DocumentIcon,
  BookOpenIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LanguageIcon
} from '@heroicons/react/24/outline';
import { translations, useTranslation } from '@/locales/quizBuilderTranslations';

// Dynamic import for PDF.js
let pdfjsLib = null;

const initPdfJs = async () => {
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }
  return pdfjsLib;
};

export default function QuizForm() {
  const [language, setLanguage] = useState('en');
  const [detectedLanguage, setDetectedLanguage] = useState('en');
  const t = useTranslation(language);

  const [formData, setFormData] = useState({
    quiz_source: 'custom',
    content: '',
    book_id: '',
    chapter_id: '',
    num_questions: 10,
    difficulty: 'medium',
    question_type: 'mixed',
  });

  // Detect language from Bengali characters (Bengali Unicode range: U+0980 to U+09FF)
  const detectLanguage = (text) => {
    if (!text) return 'en';
    const bengaliRegex = /[\u0980-\u09FF]/g;
    const bengaliMatches = text.match(bengaliRegex) || [];
    const bengaliRatio = bengaliMatches.length / text.length;
    return bengaliRatio > 0.1 ? 'bn' : 'en'; // If more than 10% Bengali characters
  };

  const [books, setBooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfError, setPdfError] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch books on mount
  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch chapters when book is selected
  useEffect(() => {
    if (formData.book_id && formData.quiz_source === 'chapter') {
      fetchChapters(formData.book_id);
    }
  }, [formData.book_id, formData.quiz_source]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/books');
      const data = await response.json();
      if (data.success) {
        setBooks(data.books);
      } else {
        setError('Failed to load books');
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchChapters = async (bookId) => {
    try {
      const response = await fetch(`/books/${bookId}/chapters`);
      const data = await response.json();
      setChapters(data.chapters || []);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      setError('Failed to load chapters. Please try again.');
    }
  };

  const extractPDFText = async (file) => {
    try {
      const pdf = await initPdfJs();
      const arrayBuffer = await file.arrayBuffer();

      // Validate PDF structure
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('PDF file is empty or corrupted');
      }

      const pdfdoc = await pdf.getDocument({ data: arrayBuffer }).promise;

      if (!pdfdoc || pdfdoc.numPages === 0) {
        throw new Error('PDF has no pages or is invalid');
      }

      let fullText = '';

      for (let i = 1; i <= pdfdoc.numPages; i++) {
        const page = await pdfdoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }

      return fullText;
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      throw new Error(error.message || 'Failed to extract text from PDF. Please ensure it is a valid PDF.');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPdfError('');
    setError('');

    // Validate file type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      const msg = t.pdfTypeError;
      setPdfError(msg);
      setError(msg);
      return;
    }

    // Validate file size (50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      const msg = t.pdfSizeError;
      setPdfError(msg);
      setError(msg);
      return;
    }

    try {
      setProcessing(true);
      setPdfFileName(file.name);
      setPdfError('');

      // Extract text from PDF
      const extractedText = await extractPDFText(file);

      if (!extractedText || extractedText.trim().length === 0) {
        const msg = t.extractionNoText;
        setPdfError(msg);
        setError(msg);
        setPdfFileName('');
        setProcessing(false);
        return;
      }

      setPdfFile(file);
      const extractedContent = extractedText;
      setFormData({ ...formData, content: extractedContent });
      // Auto-detect language from PDF content
      const detected = detectLanguage(extractedContent);
      setDetectedLanguage(detected);
      setLanguage(detected);
      setProcessing(false);
    } catch (err) {
      const msg = err.message || t.pdfExtractionError;
      setPdfError(msg);
      setError(msg);
      setPdfFileName('');
      setProcessing(false);
    }
  };

  const handleSetData = (key, value) => {
    setFormData({ ...formData, [key]: value });
    setError('');

    // Auto-detect language when content changes
    if (key === 'content') {
      const detected = detectLanguage(value);
      setDetectedLanguage(detected);
      setLanguage(detected);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate step progression
    if (step < 3) {
      if (step === 1) {
        // Step 1: Validate source selection
        if (!formData.quiz_source) {
          setError(t.selectQuizSource);
          return;
        }
        setStep(2);
      } else if (step === 2) {
        // Step 2: Validate content/selection
        if (formData.quiz_source === 'custom' && !formData.content.trim()) {
          setError(t.enterContent);
          return;
        }

        if (formData.quiz_source === 'book' && !formData.book_id) {
          setError(t.selectBookError);
          return;
        }

        if (formData.quiz_source === 'chapter') {
          if (!formData.book_id) {
            setError(t.selectBookError);
            return;
          }
          if (!formData.chapter_id) {
            setError(t.selectChapterError);
            return;
          }
        }

        if (formData.quiz_source === 'pdf' && !pdfFile) {
          setError(t.uploadPdfError);
          return;
        }

        setStep(3);
      }
      return;
    }

    // Step 3: Generate quiz
    await submitForm();
  };

  const submitForm = async () => {
    setProcessing(true);
    setError('');

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

      if (!csrfToken) {
        throw new Error(t.csrfError);
      }

      // Prepare payload based on source
      const payload = {
        num_questions: formData.num_questions,
        difficulty: formData.difficulty,
        question_type: formData.question_type || 'mixed',
        language: language,
        save_to_bank: true,
      };

      // Add source-specific data
      if (formData.quiz_source === 'custom' || formData.quiz_source === 'pdf') {
        payload.content = formData.content;
      } else if (formData.quiz_source === 'book') {
        // For book source, get book content
        const book = books.find(b => b.id === parseInt(formData.book_id));
        if (!book) {
          throw new Error(t.bookNotFound);
        }
        payload.content = `Book: ${book.title}\n\nAuthor: ${book.author}\n\nDescription: ${book.description || 'N/A'}`;
        payload.book_id = parseInt(formData.book_id);
      } else if (formData.quiz_source === 'chapter') {
        payload.chapter_id = parseInt(formData.chapter_id);
      }

      const response = await fetch('/quiz/generate-advanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || t.quizGenerationError);
      }

      // Navigate to the quiz display
      router.visit(`/quiz/${result.quiz_id}`, {
        method: 'get',
      });
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError(err.message || t.quizGenerationError);
      setProcessing(false);
    }
  };


  const SourceCard = ({ icon: Icon, title, description, value }) => (
    <button
      type="button"
      onClick={() => {
        handleSetData('quiz_source', value);
        setStep(2);
        setError('');
      }}
      className={`p-6 border-2 rounded-lg text-left transition ${
        formData.quiz_source === value
          ? 'border-purple-600 bg-purple-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <Icon
        className={`w-8 h-8 mb-3 ${
          formData.quiz_source === value ? 'text-purple-600' : 'text-gray-400'
        }`}
      />
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </button>
  );

  return (
    <AuthenticatedLayout>
      <Head title="Create Quiz" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <SparklesIcon className="w-8 h-8 text-purple-600" />
            {t.title}
          </h1>
          <p className="text-gray-600 mt-2">
            {t.subtitle}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step > s ? <CheckCircleIcon className="w-6 h-6" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > s ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{t.selectSource}</span>
            <span>{t.configureOptions}</span>
            <span>{t.reviewAndGenerate}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Select Source */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {t.selectSource}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SourceCard
                  icon={DocumentIcon}
                  title={t.customText}
                  description={t.customTextDesc}
                  value="custom"
                />
                <SourceCard
                  icon={BookOpenIcon}
                  title={t.fromBook}
                  description={t.fromBookDesc}
                  value="book"
                />
                <SourceCard
                  icon={BookOpenIcon}
                  title={t.fromChapter}
                  description={t.fromChapterDesc}
                  value="chapter"
                />
                <SourceCard
                  icon={DocumentIcon}
                  title={t.pdfUpload}
                  description={t.pdfUploadDesc}
                  value="pdf"
                />
              </div>
            </div>
          )}

          {/* Step 2: Configure Options */}
          {step === 2 && (
            <div className="bg-white rounded-lg shadow p-8 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {t.configureOptions}
              </h2>

              {/* Custom Text */}
              {formData.quiz_source === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {t.content}
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      handleSetData('content', e.target.value)
                    }
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
                    placeholder={t.contentPlaceholder}
                  />
                </div>
              )}

              {/* Book Selection */}
              {formData.quiz_source === 'book' && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {t.selectBook}
                  </label>
                  {loading ? (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                      {t.booksLoading}
                    </div>
                  ) : books.length === 0 ? (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                      {t.noBooks}{' '}
                      <a
                        href="/books/create"
                        className="underline font-medium hover:text-blue-900"
                      >
                        {t.uploadBook}
                      </a>{' '}
                      {t.first}
                    </div>
                  ) : (
                    <select
                      value={formData.book_id}
                      onChange={(e) =>
                        handleSetData('book_id', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    >
                      <option value="">Choose a book...</option>
                      {books.map((book) => (
                        <option key={book.id} value={book.id}>
                          {book.title} by {book.author}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* Chapter Selection */}
              {formData.quiz_source === 'chapter' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      {t.selectBook}
                    </label>
                    {loading ? (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                        {t.booksLoading}
                      </div>
                    ) : books.length === 0 ? (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                        {t.noBooks}{' '}
                        <a
                          href="/books/create"
                          className="underline font-medium hover:text-blue-900"
                        >
                          {t.uploadBook}
                        </a>{' '}
                        {t.first}
                      </div>
                    ) : (
                      <select
                        value={formData.book_id}
                        onChange={(e) =>
                          handleSetData('book_id', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      >
                        <option value="">Choose a book...</option>
                        {books.map((book) => (
                          <option key={book.id} value={book.id}>
                            {book.title}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      {t.selectChapter}
                    </label>
                    {!formData.book_id ? (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                        {t.selectChapterFirst}
                      </div>
                    ) : chapters.length === 0 ? (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                        {t.noChapters}
                      </div>
                    ) : (
                      <select
                        value={formData.chapter_id}
                        onChange={(e) =>
                          handleSetData('chapter_id', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      >
                        <option value="">Choose a chapter...</option>
                        {chapters.map((chapter) => (
                          <option key={chapter.id} value={chapter.id}>
                            {chapter.title}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </>
              )}

              {/* PDF Upload */}
              {formData.quiz_source === 'pdf' && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {t.uploadPdf}
                  </label>
                  {pdfError && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                      {pdfError}
                    </div>
                  )}
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="pdf-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none"
                        >
                          <span>{t.uploadPdfLabel}</span>
                          <input
                            id="pdf-upload"
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            disabled={processing}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">{t.dragDrop}</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {t.pdfSize}
                      </p>
                      {pdfFileName && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ {pdfFileName}
                        </p>
                      )}
                      {processing && (
                        <p className="text-sm text-blue-600 mt-2">
                          {t.processingPdf}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Number of Questions */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t.numQuestions}
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.num_questions}
                  onChange={(e) =>
                    handleSetData('num_questions', parseInt(e.target.value) || 10)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t.difficulty}
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    handleSetData('difficulty', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="easy">{t.difficultyEasy}</option>
                  <option value="medium">{t.difficultyMedium}</option>
                  <option value="hard">{t.difficultyHard}</option>
                </select>
              </div>

              {/* Question Type */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t.questionType}
                </label>
                <select
                  value={formData.question_type}
                  onChange={(e) =>
                    handleSetData('question_type', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="mcq">{t.questionTypeMcq}</option>
                  <option value="true-false">{t.questionTypeTrueFalse}</option>
                  <option value="mixed">{t.questionTypeMixed}</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="bg-white rounded-lg shadow p-8 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {t.review}
              </h2>
              <div className="bg-purple-50 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t.source}</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {formData.quiz_source.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.questions}</p>
                    <p className="font-semibold text-gray-900">
                      {formData.num_questions}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.difficulty}</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {formData.difficulty}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.type}</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {formData.question_type === 'mcq'
                        ? t.questionTypeMcq
                        : formData.question_type}
                    </p>
                  </div>
                </div>
              </div>

              {/* Language Selection */}
              <div className="border-t pt-6">
                <label className="block text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <LanguageIcon className="w-5 h-5 text-purple-600" />
                  {t.selectLanguage || 'Select Quiz Language'}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { code: 'bn', name: 'বাংলা (Bengali)' },
                    { code: 'en', name: 'English' },
                    { code: 'es', name: 'Español (Spanish)' },
                    { code: 'fr', name: 'Français (French)' },
                    { code: 'de', name: 'Deutsch (German)' }
                  ].map(lang => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLanguage(lang.code)}
                      className={`px-4 py-3 rounded-lg border-2 transition font-medium ${
                        language === lang.code
                          ? 'border-purple-600 bg-purple-50 text-purple-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-900'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  💡 {detectedLanguage === 'bn'
                    ? 'Bengali detected in your content'
                    : 'English selected as default'}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-medium">
                  ✨ {t.aiWillGenerate}
                </p>
                <p className="mt-1">
                  {t.aiWillGenerateDesc}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => {
                  setStep(step - 1);
                  setError('');
                }}
                disabled={processing}
                className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.back}
              </button>
            )}
            <button
              type="submit"
              disabled={processing || (formData.quiz_source === 'pdf' && !pdfFile)}
              className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition ${
                processing || (formData.quiz_source === 'pdf' && !pdfFile)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {processing
                ? t.processing
                : step === 3
                  ? t.generateQuiz
                  : t.continue}
            </button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
