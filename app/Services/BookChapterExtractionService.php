<?php

namespace App\Services;

use App\Models\Book;
use App\Models\BookChapter;
use Smalot\PdfParser\Parser;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class BookChapterExtractionService
{
    private Parser $pdfParser;

    public function __construct()
    {
        $this->pdfParser = new Parser();
    }

    /**
     * Extract chapters from a PDF file
     */
    public function extractChaptersFromPDF(Book $book): array
    {
        try {
            $filePath = Storage::disk('public')->path($book->file_path);

            if (!file_exists($filePath)) {
                Log::error("PDF file not found: $filePath");
                return [];
            }

            $pdf = $this->pdfParser->parseFile($filePath);
            $pages = $pdf->getPages();
            $chapters = [];

            $currentChapter = [
                'number' => 1,
                'title' => 'Chapter 1',
                'content' => '',
                'page_start' => 1,
                'page_end' => null,
            ];

            foreach ($pages as $pageNum => $page) {
                $text = $page->getText();

                // Simple chapter detection (can be enhanced)
                if ($this->isChapterStart($text)) {
                    if (!empty($currentChapter['content'])) {
                        $currentChapter['page_end'] = $pageNum;
                        $chapters[] = $currentChapter;
                    }

                    $currentChapter = [
                        'number' => count($chapters) + 1,
                        'title' => $this->extractChapterTitle($text),
                        'content' => $text,
                        'page_start' => $pageNum + 1,
                        'page_end' => null,
                    ];
                } else {
                    $currentChapter['content'] .= "\n" . $text;
                }
            }

            // Add the last chapter
            if (!empty($currentChapter['content'])) {
                $currentChapter['page_end'] = count($pages);
                $chapters[] = $currentChapter;
            }

            return $chapters;
        } catch (\Exception $e) {
            Log::error("Error extracting chapters from PDF: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Store extracted chapters in database
     */
    public function storeChapters(Book $book, array $chapters): void
    {
        foreach ($chapters as $chapter) {
            $keyTopics = $this->extractKeyTopics($chapter['content']);

            BookChapter::create([
                'book_id' => $book->id,
                'chapter_number' => $chapter['number'],
                'title' => $chapter['title'],
                'content' => $chapter['content'],
                'page_start' => $chapter['page_start'],
                'page_end' => $chapter['page_end'],
                'summary' => $this->generateSummary($chapter['content']),
                'key_topics' => $keyTopics,
            ]);
        }
    }

    /**
     * Extract chapters and store them
     */
    public function extractAndStoreChapters(Book $book): bool
    {
        $chapters = $this->extractChaptersFromPDF($book);

        if (empty($chapters)) {
            return false;
        }

        $this->storeChapters($book, $chapters);
        return true;
    }

    /**
     * Check if text contains chapter start pattern
     */
    private function isChapterStart(string $text): bool
    {
        return preg_match('/^\s*(CHAPTER|Chapter|SECTION|Section)\s+(\d+|[IVX]+)/m', $text) === 1;
    }

    /**
     * Extract chapter title from text
     */
    private function extractChapterTitle(string $text): string
    {
        if (preg_match('/^.*?(CHAPTER|Chapter)\s+(\d+|[IVX]+)\s*:?\s*(.+?)$/m', $text, $matches)) {
            return trim($matches[3]);
        }

        // Fallback: use first line
        $lines = explode("\n", $text);
        return trim($lines[0]) ?? 'Untitled Chapter';
    }

    /**
     * Extract key topics from chapter content
     */
    private function extractKeyTopics(string $content): array
    {
        // Simple keyword extraction
        $words = preg_split('/\s+/', strtolower($content));

        // Filter common words
        $commonWords = [
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
            'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
            'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
            'can', 'that', 'this', 'these', 'those', 'by', 'up', 'as', 'if', 'so', 'than',
            'also', 'not', 'no', 'just', 'only', 'very', 'all', 'each', 'every', 'both'
        ];

        $filtered = array_filter($words, function($word) use ($commonWords) {
            $word = preg_replace('/[^\w]/', '', $word);
            return !in_array(strtolower($word), $commonWords) && strlen($word) > 3;
        });

        // Get most frequent words
        $frequency = array_count_values($filtered);
        arsort($frequency);

        return array_keys(array_slice($frequency, 0, 15));
    }

    /**
     * Generate a summary from content
     */
    private function generateSummary(string $content, int $sentenceCount = 3): string
    {
        // Split into sentences
        $sentences = preg_split('/[.!?]+/', $content, -1, PREG_SPLIT_NO_EMPTY);

        // Get first N sentences as summary
        $summary = implode('. ', array_slice($sentences, 0, $sentenceCount));

        return trim($summary) . '.';
    }
}
