<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AIQuiz;
use App\Models\QuizResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class QuizController extends Controller
{
    /**
     * Summary of quizForm
     * @return Response|\Inertia\ResponseFactory
     */
    public function quizForm()
    {
        return inertia('Quiz/Create');
    }

    /**
     * Summary of generateQuiz
     * @param \Illuminate\Http\Request $request
     * @return Response
     */
    public function generateQuiz(Request $request): Response
    {
        $text = $request->input('text');
        $numQuestions = $request->input('num_question');
        $language = $request->input('language');

        // Fetch API key from .env
        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            return Inertia::render('Quiz/Generate', ['error' => 'API key is missing']);
        }

        // Validate num_question
        if (!empty($numQuestions) && !is_numeric($numQuestions)) {
            return Inertia::render('Quiz/Generate', ['error' => 'Invalid number of questions']);
        }

        // Generate the prompt
        $promptPrefix = !empty($numQuestions) ? "Generate exactly $numQuestions " : "Generate a quiz with ";
        $languageInstruction = !empty($language)? "All questions and answers must be written in $language language.\n": "";
        $prompt = $promptPrefix . "
        multiple-choice and true/false questions
        based on the following text:\n\n$text\n\n" .

        $languageInstruction .
         "
        Respond only with a valid JSON array in the following format:
        [
            {\"type\": \"multiple-choice\", \"question\": \"What is the capital of France?\", \"options\": [\"A) Madrid\", \"B) Berlin\", \"C) Paris\", \"D) Rome\"], \"answer\": \"C\"},
            {\"type\": \"true-false\", \"question\": \"The sun rises in the west.\", \"answer\": \"False\"}
        ]
        Do not include any extra text outside the JSON array.
        Do not generate fill-in-gaps, short-answer, or long-answer questions.\";";
        //Old model
        // $response = Http::withHeaders(['Content-Type' => 'application/json'])
        //     ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$apiKey", [
        //         "contents" => [["parts" => [["text" => $prompt]]]]
        //     ]);
        //new model
        $response = Http::withHeaders(['Content-Type' => 'application/json'])
            ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=$apiKey", [
                "contents" => [["parts" => [["text" => $prompt]]]]
            ]);


        if($response->failed()) {
            return Inertia::render('Quiz/Generate', ['error' => 'Gemini API request failed', 'details' => $response->json()]);
        }

        // Extract and process API response
        $quizJson = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? '';
        preg_match('/\[[\s\S]*\]/', $quizJson, $matches);
        $cleanJson = $matches[0] ?? '';
        $quizArray = json_decode($cleanJson, true);

        if (!is_array($quizArray)) {
            return Inertia::render('Quiz/Generate', ['error' => 'Invalid JSON format returned from Gemini API', 'raw_response' => $quizJson]);
        }

        // Truncate and number questions
        if (!empty($numQuestions) && count($quizArray) > $numQuestions) {
            $quizArray = array_slice($quizArray, 0, $numQuestions);
        }

        foreach ($quizArray as $index => &$question) {
            $question['question_no'] = $index + 1;
        }
        //store the full response in the database
        $quizId = null;
        if($quizJson){
            $quiz = AIQuiz::create([
                'user_id' => auth()->id(),
                'title' =>  $text,
                'full_response' => $response->json(),
                'status' => $quizJson ? 1 : 0,
                'language' => $language ?? 'en',
            ]);
            $quizId = $quiz->id;
        }


        return Inertia::render('Quiz/Generate', ['quiz' => $quizArray, 'quizId' => $quizId]);
    }

    /**
     * Store the quiz result with user answers and score
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function submitQuizResult(Request $request)
    {
        try {
            $validated = $request->validate([
                'quiz_id' => 'required|integer|exists:a_i_quizzes,id',
                'user_answers' => 'required|array',
                'quiz_questions' => 'required|array',
                'score' => 'required|numeric|min:0|max:100',
                'correct_count' => 'required|integer|min:0',
                'total_count' => 'required|integer|min:1',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }

        try {
            // Verify the quiz belongs to the authenticated user
            $quiz = AIQuiz::where('id', $request->quiz_id)
                ->where('user_id', auth()->id())
                ->firstOrFail();

            // Create the quiz result
            $quizResult = QuizResult::create([
                'user_id' => auth()->id(),
                'quiz_id' => $validated['quiz_id'],
                'user_answers' => $validated['user_answers'],
                'quiz_questions' => $validated['quiz_questions'],
                'score' => $validated['score'],
                'correct_count' => $validated['correct_count'],
                'total_count' => $validated['total_count'],
            ]);

            return response()->json([
                'success' => true,
                'result_id' => $quizResult->id,
                'message' => 'Quiz result saved successfully'
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Quiz not found or unauthorized'
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Quiz submission error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to save quiz result: ' . $e->getMessage()
            ], 500);
        }
    }
}
