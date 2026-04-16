import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Generate() {
    const { props } = usePage();
    const quizQuestions = props.quiz ?? [];
    const quizId = props.quizId ?? null;
    const quizData = props.quizData ?? {};
    const quizTitle = quizData?.title || 'Quiz';
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [error, setError] = useState(props.error || '');
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [score, setScore] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleAnswerSelect = (questionId, option) => {
        if (!isQuizCompleted) {
            const question = quizQuestions.find(q => q.question_no === questionId);
            if (question) {
                if(question.type === "multiple-choice"){
                    if (question.options) {
                        const optionIndex = question.options.indexOf(option);
                        const optionLetter = String.fromCharCode(65 + optionIndex); // A=65, B=66, etc.
                        setUserAnswers({ ...userAnswers, [questionId]: optionLetter });
                    }
                } else if (question.type === "true-false"){
                    setUserAnswers({ ...userAnswers, [questionId]: option });
                }
            }
        }
    };

    const handleTextAnswerChange = (questionId, answer) => {
        if (!isQuizCompleted) {
            setUserAnswers({ ...userAnswers, [questionId]: answer });
        }
    };

    const calculateScore = () => {
        let correctCount = 0;
        quizQuestions.forEach((q) => {
            if (q.type === "multiple-choice" || q.type === "true-false") {
                const userAnswer = userAnswers[q.question_no]?.trim().toLowerCase();
                const correctAnswer = q.answer?.trim().toLowerCase();
                if (userAnswer === correctAnswer) {
                    correctCount++;
                }
            } else {
                const userAnswer = userAnswers[q.question_no]?.trim().toLowerCase();
                const correctAnswer = q.answer?.trim().toLowerCase();
                if (userAnswer === correctAnswer) {
                    correctCount++;
                }
            }
        });
        const calculatedScore = (correctCount / quizQuestions.length) * 100;
        setScore(calculatedScore);
        return { calculatedScore, correctCount };
    };

    const handleShowResults = async () => {
        if (!quizId) {
            setError('Quiz ID is missing. Please try again.');
            return;
        }

        const { calculatedScore, correctCount } = calculateScore();
        setShowResults(true);
        setIsQuizCompleted(true);

        // Save results to the backend
        setIsSubmitting(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

            if (!csrfToken) {
                setError('Security error: CSRF token not found. Please refresh the page and try again.');
                setIsSubmitting(false);
                return;
            }

            const response = await fetch('/quiz/submit-result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    quiz_id: quizId,
                    user_answers: userAnswers,
                    quiz_questions: quizQuestions,
                    score: parseFloat(calculatedScore.toFixed(2)),
                    correct_count: correctCount,
                    total_count: quizQuestions.length,
                }),
            });

            const contentType = response.headers.get('content-type');

            if (!response.ok) {
                let errorMessage = 'Failed to save quiz result.';

                if (contentType && contentType.includes('application/json')) {
                    try {
                        const errorData = await response.json();
                        console.error('Failed to save quiz result:', errorData);
                        if (errorData.message) {
                            errorMessage = errorData.message;
                        }
                    } catch (e) {
                        console.error('Could not parse error response:', e);
                    }
                } else {
                    const text = await response.text();
                    console.error('Server returned non-JSON response:', text.substring(0, 200));
                    errorMessage = `Server error (${response.status}). Please refresh and try again.`;
                }

                setError(errorMessage);
            } else {
                try {
                    const successData = await response.json();
                    console.log('Quiz result saved successfully:', successData);
                    setTimeout(() => {
                        router.visit(route('my-quizzes'));
                    }, 1500);
                } catch (e) {
                    console.error('Could not parse success response:', e);
                    setError('Quiz submitted, but received an unexpected response. Redirecting...');
                    setTimeout(() => {
                        router.visit(route('my-quizzes'));
                    }, 2000);
                }
            }
        } catch (err) {
            console.error('Error submitting quiz result:', err);
            setError('Network error: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }

        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Quiz: ${quizTitle}`} />
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Back Button and Title */}
                    <div className="mb-6">
                        <button
                            onClick={() => router.back()}
                            className="text-purple-600 hover:text-purple-800 mb-4 flex items-center gap-2"
                        >
                            ← Back
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">{quizTitle}</h1>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        {showResults && (
                            <div className="text-center mb-6 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                                <h3 className="text-3xl font-bold text-purple-800">Your Score: {score.toFixed(2)}%</h3>
                                <p className="text-purple-600 mt-2">
                                    {score >= 80 ? 'Excellent!' : score >= 60 ? 'Good job!' : 'Keep practicing!'}
                                </p>
                            </div>
                        )}
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Quiz Questions</h2>
                        {quizQuestions.map((question) => (
                            <div key={question.question_no} className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
                                <p className="font-semibold text-lg mb-4 text-gray-800">
                                    {question.question_no}. {question.question}
                                </p>
                                {question.type === "multiple-choice" && (
                                <ul className="space-y-2">
                                    {question.options.map((option, idx) => (
                                        <li key={idx}>
                                            <button
                                                onClick={() => handleAnswerSelect(question.question_no, option)}
                                                className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                                                    userAnswers[question.question_no] === String.fromCharCode(65 + question.options.indexOf(option))
                                                        ? 'bg-purple-600 text-white border-purple-600'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-purple-50 hover:border-purple-300'
                                                } ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
                                                disabled={isQuizCompleted}
                                            >
                                                {option}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                                {question.type === "true-false" && (
                                    <ul className="space-y-2">
                                        <li>
                                            <button
                                                onClick={() => handleAnswerSelect(question.question_no, "True")}
                                                className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${userAnswers[question.question_no] === "True" ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-purple-50 hover:border-purple-300'} ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
                                                disabled={isQuizCompleted}
                                            >
                                                True
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => handleAnswerSelect(question.question_no, "False")}
                                                className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${userAnswers[question.question_no] === "False" ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-purple-50 hover:border-purple-300'} ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
                                                disabled={isQuizCompleted}
                                            >
                                                False
                                            </button>
                                        </li>
                                    </ul>
                                )}
                                {question.type === "fill-in-gaps" && (
                                    <input
                                        type="text"
                                        value={userAnswers[question.question_no] || ""}
                                        onChange={(e) => handleTextAnswerChange(question.question_no, e.target.value)}
                                        className={`mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
                                        disabled={isQuizCompleted}
                                        placeholder="Enter your answer..."
                                    />
                                )}
                                {question.type === "short-answer" && (
                                    <input
                                        type="text"
                                        value={userAnswers[question.question_no] || ""}
                                        onChange={(e) => handleTextAnswerChange(question.question_no, e.target.value)}
                                        className={`mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
                                        disabled={isQuizCompleted}
                                        placeholder="Enter your answer..."
                                    />
                                )}
                                {question.type === "long-answer" && (
                                    <textarea
                                        value={userAnswers[question.question_no] || ""}
                                        onChange={(e) => handleTextAnswerChange(question.question_no, e.target.value)}
                                        className={`mt-2 p-3 border border-gray-300 rounded-lg w-full h-32 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
                                        disabled={isQuizCompleted}
                                        placeholder="Enter your detailed answer..."
                                    />
                                )}

                            {showResults && (
                                <div className="mt-4 p-4 rounded-lg">
                                    <p
                                        className={`font-bold text-lg ${
                                            userAnswers[question.question_no]?.trim().toLowerCase() === question.answer?.trim().toLowerCase()
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}
                                    >
                                        {userAnswers[question.question_no]?.trim().toLowerCase() === question.answer?.trim().toLowerCase()
                                            ? '✓ Correct'
                                            : '✗ Incorrect'}
                                    </p>
                                    {userAnswers[question.question_no]?.trim().toLowerCase() !== question.answer?.trim().toLowerCase() && (
                                        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <p className="text-green-800 font-semibold">Correct Answer:</p>
                                            <p className="text-green-700">{question.answer}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            </div>
                        ))}

                        {!isQuizCompleted && (
                            <div className="text-center mt-8">
                                <button
                                    onClick={handleShowResults}
                                    disabled={isSubmitting}
                                    className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? "Saving..." : "Submit Quiz & Show Results"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
