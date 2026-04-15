import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Generate() {
    const { props } = usePage();
    const quizQuestions = props.quiz ?? [];
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [error, setError] = useState(props.error || '');
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [score, setScore] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [resultsFromServer, setResultsFromServer] = useState(null);
    const [detailedResults, setDetailedResults] = useState({});

    // Get CSRF token from Inertia props
    const getCsrfToken = () => {
        // Try to get from props first (Inertia provides it)
        if (props && props.csrf_token) {
            return props.csrf_token;
        }

        // Fallback: try meta tag
        const metaToken = document.querySelector('meta[name="csrf-token"]');
        if (metaToken) {
            return metaToken.getAttribute('content');
        }

        // Last resort: try to find in DOM
        const tokenInput = document.querySelector('input[name="_token"]');
        if (tokenInput) {
            return tokenInput.value;
        }

        return '';
    };


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
        const detailed = {};

        quizQuestions.forEach((q) => {
            const userAnswer = userAnswers[q.question_no]?.trim().toLowerCase();
            const correctAnswer = q.answer?.trim().toLowerCase();
            const isCorrect = userAnswer === correctAnswer;

            detailed[q.question_no] = isCorrect;

            if (isCorrect) {
                correctCount++;
            }
        });

        setDetailedResults(detailed);
        const calculatedScore = (correctCount / quizQuestions.length) * 100;
        setScore(calculatedScore);
        setCorrectAnswers(correctCount);
        setWrongAnswers(quizQuestions.length - correctCount);
        return calculatedScore;
    };

    const handleShowResults = async () => {
        try {
            // First calculate local score
            const localScore = calculateScore();
            setShowResults(true);

            // Then submit to server using AJAX
            setIsSubmitting(true);

            // Get CSRF token
            const csrfToken = getCsrfToken();

            // Ensure all questions have answers (even if empty)
            const completeAnswers = {};
            quizQuestions.forEach((q) => {
                completeAnswers[q.question_no] = userAnswers[q.question_no] || '';
            });

            console.log('Quiz Data:', quizQuestions);
            console.log('User Answers:', completeAnswers);
            console.log('Quiz ID:', props.quiz_id);

            const response = await fetch('/api/quiz/submit-answers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    quiz_id: props.quiz_id,
                    answers: completeAnswers,
                    quiz_data: quizQuestions,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setResultsFromServer(data);
                setSubmitSuccess(true);
                setError('');

                // Scroll to top to show results
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
            } else {
                throw new Error(data.error || 'Unknown error occurred');
            }
        } catch (err) {
            console.error('Error submitting quiz:', err);
            setError('Failed to submit quiz: ' + err.message);
        } finally {
            setIsSubmitting(false);
            setIsQuizCompleted(true);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Quiz Results" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    {submitSuccess && resultsFromServer && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                            Quiz submitted successfully! Results have been saved.
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        {showResults && (
                            <div className="text-center mb-6 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                                <h3 className="text-3xl font-bold text-purple-800">Your Score: {resultsFromServer ? resultsFromServer.score : score.toFixed(2)}%</h3>
                                <p className="text-purple-600 mt-2">
                                    {(resultsFromServer ? resultsFromServer.score : score) >= 80 ? 'Excellent!' : (resultsFromServer ? resultsFromServer.score : score) >= 60 ? 'Good job!' : 'Keep practicing!'}
                                </p>
                                <p className="text-purple-600 mt-3 text-lg">
                                    Correct: {resultsFromServer ? resultsFromServer.correct_answers : correctAnswers} | Wrong: {resultsFromServer ? resultsFromServer.wrong_answers : wrongAnswers}
                                </p>
                                {isSubmitting && (
                                    <p className="text-purple-600 mt-3 flex items-center justify-center gap-2">
                                        <span className="inline-flex h-3 w-3 bg-purple-600 rounded-full animate-pulse"></span>
                                        Saving results...
                                    </p>
                                )}
                                {submitSuccess && (
                                    <p className="text-green-600 mt-3 font-semibold">✓ Results saved to your profile</p>
                                )}
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
                                            detailedResults[question.question_no]
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}
                                    >
                                        {detailedResults[question.question_no]
                                            ? '✓ Correct'
                                            : '✗ Incorrect'}
                                    </p>
                                    {!detailedResults[question.question_no] && (
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
                                    {isSubmitting ? 'Submitting...' : 'Submit Quiz & Show Results'}
                                </button>
                            </div>
                        )}

                        {isQuizCompleted && submitSuccess && (
                            <div className="text-center mt-8">
                                <button
                                    onClick={() => router.visit('/quiz/form')}
                                    className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200 font-semibold text-lg"
                                >
                                    Take Another Quiz
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
