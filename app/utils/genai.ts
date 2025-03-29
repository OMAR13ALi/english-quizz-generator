import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const AZURE_API_KEY = process.env.AZURE_API_KEY;

if (!AZURE_API_KEY) {
  throw new Error("AZURE_API_KEY is not set in environment variables");
}

const client = ModelClient(
  "https://models.inference.ai.azure.com",
  new AzureKeyCredential(AZURE_API_KEY)
);

// Define the QuizQuestion interface
export interface QuizQuestion {
  question: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  correctAnswer: string;
}

// Simple question categories with their emojis
const questionTypes = [
  { category: "grammar", prompt: "Generate a multiple-choice question about English grammar rules.", emoji: "📝" },
  { category: "vocabulary", prompt: "Create a question about English vocabulary and word meanings.", emoji: "📚" },
  { category: "idioms", prompt: "Create a question about common English idioms and expressions.", emoji: "🗣️" },
  { category: "pronunciation", prompt: "Generate a question about English pronunciation.", emoji: "🎤" },
  { category: "spelling", prompt: "Create a question about English spelling rules.", emoji: "✏️" },
  { category: "tenses", prompt: "Generate a question about English verb tenses.", emoji: "⏰" },
  { category: "prepositions", prompt: "Create a question about English prepositions.", emoji: "📍" },
  { category: "articles", prompt: "Generate a question about English articles (a, an, the).", emoji: "📄" },
  { category: "synonyms", prompt: "Create a question about English synonyms.", emoji: "🔄" },
  { category: "antonyms", prompt: "Generate a question about English antonyms.", emoji: "⚔️" }
] as const;

// Cache for recent questions
const recentQuestions = new Set<string>();
const MAX_CACHE_SIZE = 50;

// Add question to cache
const addToCache = (question: string) => {
  if (!question) return; // Skip if question is undefined or empty
  if (recentQuestions.size >= MAX_CACHE_SIZE) {
    const firstItem = recentQuestions.values().next().value;
    // @ts-ignore: We know firstItem exists because Set is not empty
    recentQuestions.delete(firstItem);
  }
  recentQuestions.add(question);
};

// Check if question is unique
const isUniqueEnough = (question: string): boolean => {
  return !Array.from(recentQuestions).some(q => 
    question.toLowerCase().includes(q.toLowerCase()) || 
    q.toLowerCase().includes(question.toLowerCase())
  );
};

// Backup questions
const backupQuestions: QuizQuestion[] = [
  {
    question: "What is the correct form of the verb? 'She ___ to the store yesterday.' 📝",
    options: [
      { id: "A", text: "go" },
      { id: "B", text: "went" },
      { id: "C", text: "goes" },
      { id: "D", text: "going" }
    ],
    correctAnswer: "B"
  },
  {
    question: "Choose the correct spelling: 📚",
    options: [
      { id: "A", text: "recieve" },
      { id: "B", text: "receive" },
      { id: "C", text: "receeve" },
      { id: "D", text: "receve" }
    ],
    correctAnswer: "B"
  },
  {
    question: "What does the idiom 'break a leg' mean? 🎭",
    options: [
      { id: "A", text: "Actually break your leg" },
      { id: "B", text: "Good luck" },
      { id: "C", text: "Run away" },
      { id: "D", text: "Take a break" }
    ],
    correctAnswer: "B"
  }
];

let backupIndex = 0;

export async function generateQuizQuestion(): Promise<QuizQuestion> {
  try {
    // Select a random question type
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          {
            role: "system",
            content: `You are an English teacher creating quiz questions. Format your response exactly like this:
QUESTION: (write your question)
A: (first option)
B: (second option)
C: (third option)
D: (fourth option)
CORRECT: (A, B, C, or D)

Make sure one option is clearly correct. Use simple, clear language.`
          },
          {
            role: "user",
            content: questionType.prompt
          }
        ],
        model: "DeepSeek-V3",
        temperature: 0.7,
        max_tokens: 300,
        top_p: 0.95
      }
    });

    if (isUnexpected(response)) {
      throw new Error("Unexpected response from API");
    }

    const content = response.body.choices[0].message.content;
    if (!content || typeof content !== 'string') {
      throw new Error("Invalid response format from API");
    }

    // Parse the response
    const lines = content.split('\n').map(line => line.trim());
    const extractContent = (prefix: string): string => {
      const line = lines.find(l => l.startsWith(prefix));
      return line ? line.substring(prefix.length).trim() : '';
    };

    // Extract parts
    const rawQuestion = extractContent('QUESTION:');
    const optionA = extractContent('A:');
    const optionB = extractContent('B:');
    const optionC = extractContent('C:');
    const optionD = extractContent('D:');
    const correctAnswer = extractContent('CORRECT:');

    // Validate parts
    if (!rawQuestion || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
      throw new Error("Incomplete response structure");
    }

    // Format question with emoji
    const question = `${rawQuestion} ${questionType.emoji}`;

    // Check uniqueness before creating the question
    if (!isUniqueEnough(question)) {
      throw new Error("Question too similar to recent ones");
    }

    // Add to cache since we know it's unique
    addToCache(question);

    // Create quiz question
    const quizQuestion: QuizQuestion = {
      question,
      options: [
        { id: "A", text: optionA },
        { id: "B", text: optionB },
        { id: "C", text: optionC },
        { id: "D", text: optionD }
      ],
      correctAnswer: correctAnswer.toUpperCase()
    };

    // Validate correct answer
    if (!["A", "B", "C", "D"].includes(quizQuestion.correctAnswer)) {
      throw new Error("Invalid correct answer");
    }

    return quizQuestion;

  } catch (error) {
    console.error("Error generating question:", error);
    
    // Return a backup question
    const backupQuestion = backupQuestions[backupIndex % backupQuestions.length];
    backupIndex = (backupIndex + 1) % backupQuestions.length;
    return { ...backupQuestion };
  }
}