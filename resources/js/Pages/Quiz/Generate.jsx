import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Generate() {

const { props } = usePage();

const quizQuestions = props.quiz ?? [];

// SETTINGS
const QUIZ_TIME = 120; // seconds

// STATES
const [userAnswers, setUserAnswers] = useState({});
const [showResults, setShowResults] = useState(false);
const [timeLeft, setTimeLeft] = useState(QUIZ_TIME);
const [quizFinished, setQuizFinished] = useState(false);

// TIMER
useEffect(() => {

if (quizFinished) return;

if (timeLeft <= 0){

finishQuiz();
return;

}

const timer = setTimeout(()=>{

setTimeLeft(timeLeft - 1);

},1000);

return ()=> clearTimeout(timer);

},[timeLeft, quizFinished]);

// FINISH
const finishQuiz = ()=>{

setShowResults(true);
setQuizFinished(true);

};

// retry
const retryQuiz = ()=>{

setUserAnswers({});
setShowResults(false);
setTimeLeft(QUIZ_TIME);
setQuizFinished(false);

};

// answer select
const handleAnswerSelect = (id, option)=>{

        if (quizFinished) return;

        const question = quizQuestions.find(q=>q.question_no === id);

        if (!question) return;

        if(question.type === "multiple-choice"){

        const index = question.options.indexOf(option);

        const letter = String.fromCharCode(65 + index);

        setUserAnswers(prev=>({...prev,[id]:letter}));

        }
        else{

        setUserAnswers(prev=>({...prev,[id]:option}));

        }

};

const handleText = (id,value)=>{
    if (quizFinished) return;
    setUserAnswers(prev=>({...prev,[id]:value}));
};

// stats
const stats = useMemo(()=>{
let correct=0,incorrect=0,unanswered=0;
quizQuestions.forEach(q=>{
const ua = userAnswers[q.question_no];
if(!ua){
unanswered++;
}
else if(ua.toLowerCase() === q.answer.toLowerCase()){
correct++;
}
else{
incorrect++;
}

});

return{
    correct,
    incorrect,
    unanswered,
    score:(correct/quizQuestions.length)*100
};

},[userAnswers]);

// progress
const progress =
((quizQuestions.length - stats.unanswered)
/
quizQuestions.length)*100;

// format time
const formatTime = ()=>{

const m = Math.floor(timeLeft/60);
const s = timeLeft%60;

return `${m}:${s<10?"0":""}${s}`;

};

return(

    <AuthenticatedLayout>

            <Head title="Quiz"/>

            <div className="max-w-4xl mx-auto p-6">

            {/* TIMER */}

            <div className="flex justify-between mb-4">

            {/* <div className="text-xl font-bold">

            Time Left: {formatTime()}

            </div> */}

            {/* {!quizFinished && (

            <button
            onClick={retryQuiz}
            className="bg-yellow-500 text-white px-4 py-1 rounded"

            >

            Retry

            </button>

            )} */}

            </div>

            {/* Progress */}

            <div className="w-full bg-gray-200 mb-6">

            <div
            className="bg-purple-600 text-white text-center"
            style={{width:`${progress}%`}}
            >

            {Math.round(progress)}%

            </div>

            </div>

            {/* Summary */}

            {showResults &&(

                    <div className="bg-white p-4 mb-4 shadow">

                    <h2 className="text-xl font-bold">

                    Result Summary

                    </h2>

                    <p>Score: {stats.score.toFixed(1)}%</p>

                    <p className="text-green-600">

                    Correct: {stats.correct}

                    </p>

                    <p className="text-red-600">

                    Incorrect: {stats.incorrect}

                    </p>

                    <p className="text-yellow-600">

                    Unanswered: {stats.unanswered}

                    </p>

                    {/* <button className="bg-green-600 text-white px-4 py-2 mt-3">

                    Download Certificate

                    </button> */}

                    </div>

            )}

            {/* Questions */}

            {quizQuestions.map(q=>(

                    <div key={q.question_no}
                    className="bg-white p-4 mb-4 shadow">

                    <p className="font-bold">

                    {q.question_no}. {q.question}

                    </p>

                    {/* MCQ */}

                    {q.type==="multiple-choice"

                    &&

                    q.options.map((opt,i)=>(

                    <button

                    key={i}

                    onClick={()=>handleAnswerSelect(q.question_no,opt)}

                    disabled={quizFinished}

                    className={`block w-full text-left border p-2 my-1

                    ${userAnswers[q.question_no]
                    ===String.fromCharCode(65+i)
                    ?"bg-purple-600 text-white"
                    :"bg-gray-100"}

                    `}

                    >

                    Option {String.fromCharCode(65+i)}

                    </button>

                    ))

                    }

                    {/* true-false */}

                    {q.type==="true-false"

                    &&

                    ["true","false"].map((opt,i)=>(

                    <button

                    key={i}

                    onClick={()=>handleAnswerSelect(q.question_no,opt)}

                    disabled={quizFinished}

                    className={`block w-full text-left border p-2 my-1

                    ${userAnswers[q.question_no]
                    ===opt
                    ?"bg-purple-600 text-white"
                    :"bg-gray-100"}

                    `}

                    >

                    {opt.charAt(0).toUpperCase() + opt.slice(1)}

                    </button>

                    ))

                    }

                    {/* text */}

                    {q.type!=="multiple-choice" && q.type!=="true-false"

                    &&

                    <input

                    className="border w-full p-2 mt-2"

                    value={userAnswers[q.question_no]||""}

                    onChange={(e)=>handleText(q.question_no,e.target.value)}

                    disabled={quizFinished}

                    />

                    }

                    {/* show correct only after time */}

                    {showResults &&(

                    <div className="mt-2">

                    {

                    !userAnswers[q.question_no]

                    ?

                    <span className="text-yellow-600">

                    Unanswered

                    </span>

                    :

                    userAnswers[q.question_no]
                    .toLowerCase()
                    ===q.answer.toLowerCase()

                    ?

                    <span className="text-green-600">

                    Correct

                    </span>

                    :

                    <span className="text-red-600">

                    Incorrect (Correct: {q.answer})

                    </span>

                    }

                    </div>

                    )}

                    </div>

            ))}

            {/* submit */}

            {!quizFinished &&(
                <button
                onClick={finishQuiz}
                className="bg-purple-600 text-white px-6 py-2"

                >

                Submit

                </button>
            )}

            </div>

</AuthenticatedLayout>

);

}
