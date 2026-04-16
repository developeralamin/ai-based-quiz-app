import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const optionLabel = (idx) => String.fromCharCode(65 + idx); // A, B, C...

function normalize(v) {
    if (v === null || v === undefined) return '';
    return String(v).trim().toLowerCase();
}

export default function Details({ auth, conversation, quizResult }) {
    if (!quizResult) {
        return (
            <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Conversation Details</h2>}>
                <Head title="Conversation Details" />
                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                {conversation.title && conversation.title.length > 50
                                    ? conversation.title.substring(0, 50) + '...'
                                    : conversation.title}
                            </h3>
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                <p className="text-yellow-800 font-medium">No results yet</p>
                                <p className="text-yellow-700 text-sm mt-2">
                                    This quiz hasn't been attempted yet. Please take the quiz to see your results here.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    const questions = quizResult.quiz_questions || [];
    const userAnswersMap = quizResult.user_answers || {};
    const total = questions.length;
    const correctCount = parseInt(quizResult.correct_count, 10) || 0;
    const scorePercent = typeof quizResult.score === 'number'
        ? quizResult.score
        : parseFloat(quizResult.score) || 0;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Conversation Details
                </h2>
            }
        >
            <Head title="Conversation Details" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">

                    {/* Score Card */}
                    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-medium truncate">
                            {conversation.title && conversation.title.length > 50
                                ? conversation.title.substring(0, 50) + '...'
                                : conversation.title}
                        </h3>

                        <div className="mt-4 p-4 bg-purple-50 rounded">
                            <p className="text-2xl font-semibold text-purple-700">
                                Your Score: {scorePercent.toFixed(2)}%
                            </p>
                            <p className="text-sm text-gray-600">
                                {correctCount} of {total} correct
                            </p>
                        </div>

                        <div className="mt-4 text-sm text-gray-600">
                            <p>Submitted: {new Date(quizResult.created_at).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Questions */}
                    {questions.length > 0 ? (
                        questions.map((question, qIndex) => {
                            const questionNo = question.question_no || qIndex + 1;
                            const userAnswer = userAnswersMap[questionNo];
                            const correctAnswer = question.answer;
                            const isCorrect = normalize(userAnswer) === normalize(correctAnswer);
                            const type = question.type || 'short-answer';
                            const options = question.options || [];

                            return (
                                <div
                                    key={qIndex}
                                    className="bg-white shadow rounded-lg p-6 mb-6"
                                >
                                    <div className="mb-4">
                                        <div className="text-sm text-gray-500">
                                            {questionNo}.
                                        </div>
                                        <div className="text-lg font-medium">
                                            {question.question}
                                        </div>
                                    </div>

                                    {/* Multiple Choice / True False */}
                                    {options.length > 0 ? (
                                        <div className="space-y-3">
                                            {options.map((opt, idx) => {
                                                const label = optionLabel(idx);
                                                const optText = typeof opt === 'string' ? opt : opt.text ?? '';
                                                const isOptionCorrect = normalize(correctAnswer) === normalize(label) || normalize(correctAnswer) === normalize(optText);
                                                const isUserChoice = normalize(userAnswer) === normalize(label) || normalize(userAnswer) === normalize(optText);

                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`border rounded p-3 ${
                                                            isOptionCorrect
                                                                ? 'bg-green-50 border-green-300'
                                                                : isUserChoice && !isCorrect
                                                                ? 'bg-red-50 border-red-300'
                                                                : 'bg-white border-gray-200'
                                                        }`}
                                                    >
                                                        <div className="flex gap-3">
                                                            <div className="font-semibold w-8">
                                                                {label})
                                                            </div>
                                                            <div className="text-sm">
                                                                {optText}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-700 space-y-2">
                                            <p>
                                                <strong>Your Answer:</strong>{' '}
                                                <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                                                    {String(userAnswer ?? 'Not answered')}
                                                </span>
                                            </p>
                                            {!isCorrect && (
                                                <p>
                                                    <strong>Correct Answer:</strong>{' '}
                                                    <span className="text-green-600">{String(correctAnswer ?? '—')}</span>
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-4">
                                        {isCorrect ? (
                                            <div className="text-green-600 font-semibold">
                                                ✓ Correct
                                            </div>
                                        ) : (
                                            <div className="text-red-600 font-semibold">
                                                ✕ Incorrect
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white shadow rounded-lg p-6">
                            No quiz questions found.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
