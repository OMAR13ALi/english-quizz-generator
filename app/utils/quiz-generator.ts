import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

// Get GitHub token for authentication
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  console.error("GITHUB_TOKEN is not defined in environment variables");
  throw new Error("GITHUB_TOKEN is not set in environment variables");
}

// Define the quiz question structure
export interface QuizQuestion {
  question: string;
  options: Array<{
    id: OptionId;
    text: string;
  }>;
  correctAnswer: OptionId;
}

// Type for valid option IDs
export type OptionId = "A" | "B" | "C" | "D";

// Backup questions to use if API fails
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

// Keep track of backup question index
let backupIndex = 0;

// Question prompts with emojis
const questionPrompts = [
  { prompt: "Generate a multiple-choice question about English grammar rules.", emoji: "📝" },
  { prompt: "Create a question about English vocabulary and word meanings.", emoji: "📚" },
  { prompt: "Create a question about common English idioms and expressions.", emoji: "🗣️" },
  { prompt: "Generate a question about English pronunciation.", emoji: "🎤" },
  { prompt: "Create a question about English spelling rules.", emoji: "✏️" },
  { prompt: "Generate a question about English verb tenses.", emoji: "⏰" },
  { prompt: "Create a question about English prepositions.", emoji: "📍" },
  { prompt: "Generate a question about English articles (a, an, the).", emoji: "📄" },
  { prompt: "Create a question about English synonyms.", emoji: "🔄" },
  { prompt: "Generate a question about English antonyms.", emoji: "⚔️" }
];

// Simple function to parse the response
function parseResponse(content: string): QuizQuestion | null {
  try {
    console.log("Parsing response:", content);
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    
    // Extract the question
    let questionLine = "";
    let options: {id: OptionId, text: string}[] = [];
    let correctAnswer: OptionId | null = null;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith("QUESTION:")) {
        questionLine = trimmed.substring("QUESTION:".length).trim();
      } 
      else if (trimmed.match(/^A:/i)) {
        options.push({ id: "A", text: trimmed.substring(2).trim() });
      }
      else if (trimmed.match(/^B:/i)) {
        options.push({ id: "B", text: trimmed.substring(2).trim() });
      }
      else if (trimmed.match(/^C:/i)) {
        options.push({ id: "C", text: trimmed.substring(2).trim() });
      }
      else if (trimmed.match(/^D:/i)) {
        options.push({ id: "D", text: trimmed.substring(2).trim() });
      }
      else if (trimmed.match(/^CORRECT:/i)) {
        const answer = trimmed.substring("CORRECT:".length).trim().toUpperCase();
        if (["A", "B", "C", "D"].includes(answer)) {
          correctAnswer = answer as OptionId;
        }
      }
    }
    
    // Validate we have everything
    if (!questionLine || options.length !== 4 || !correctAnswer) {
      console.error("Failed to parse response - missing elements:", {
        hasQuestion: !!questionLine,
        optionsCount: options.length,
        hasCorrectAnswer: !!correctAnswer
      });
      return null;
    }
    
    // Get a random emoji for the question type
    const randomPrompt = questionPrompts[Math.floor(Math.random() * questionPrompts.length)];
    
    return {
      question: `${questionLine} ${randomPrompt.emoji}`,
      options,
      correctAnswer
    };
  } catch (error) {
    console.error("Error parsing response:", error);
    return null;
  }
}

// Main function to generate a quiz question
export async function generateQuizQuestion(): Promise<QuizQuestion> {
  try {
    console.log("Creating Phi-4 client...");
    const client = ModelClient(
      "https://models.inference.ai.azure.com",
      new AzureKeyCredential(GITHUB_TOKEN as string)
    );
    
    // Select a random question prompt
    const promptIndex = Math.floor(Math.random() * questionPrompts.length);
    const promptData = questionPrompts[promptIndex];
    console.log("Selected prompt:", promptData.prompt);
    
    console.log("Making API request to Phi-4...");
//     const response = await client.path("/chat/completions").post({
//       body: {
//         messages: [
//           {
//             role: "system",
//             content: `You are an English teacher creating quiz questions. Format your response EXACTLY like this template:

// QUESTION: (write your question here)
// A: (first option)
// B: (second option)
// C: (third option)
// D: (fourth option)
// CORRECT: (A, B, C, or D)

// Do not add any other text before or after the template. Make sure one option is clearly correct. Use simple, clear language.`
//           },
//           {
//             role: "user",
//             content: promptData.prompt
//           }
//         ],
//         model: "Phi-4",
//         temperature: 0.7,
//         max_tokens: 500,
//         top_p: 0.95
//       }
//     });
// const response = await client.path("/chat/completions").post({
//   body: {
//     messages: [
//       {
//         role: "system",
//         content: `You are an engaging and creative English teacher known for generating fun, varied, and original quiz questions. Your questions should entertain as well as educate, incorporating unique themes, humorous twists, or interesting trivia while ensuring the language remains simple and clear. Each question should be crafted in a way that avoids repetition and feels fresh every time.

// Format your response EXACTLY like this template:

// QUESTION: (write your question here)
// A: (first option)
// B: (second option)
// C: (third option)
// D: (fourth option)
// CORRECT: (A, B, C, or D)

// Do not add any other text before or after the template. Ensure that one option is clearly the correct answer.`
//       },
//       {
//         role: "user",
//         content: promptData.prompt
//       }
//     ],
//     model: "Phi-4",
//     temperature: 0.7,
//     max_tokens: 500,
//     top_p: 0.95
//   }
// });

const response = await client.path("/chat/completions").post({
  body: {
    messages: [
      {
        role: "system",
        content: `You are an engaging and creative English teacher known for generating fun, varied, and original quiz questions that cover multiple themes. Your questions should entertain as well as educate, incorporating unique themes such as grammar, general knowledge, history, science, and pop culture. Create a mix of easy, intermediate, and hard questions, ensuring they are distinct and never repeated.

Format your response EXACTLY like this template:

QUESTION: (write your question here)
A: (first option)
B: (second option)
C: (third option)
D: (fourth option)
CORRECT: (A, B, C, or D)

Do not add any other text before or after the template. Ensure that one option is clearly the correct answer.`
      },
      {
        role: "user",
        content: promptData.prompt
      }
    ],
    model: "Phi-4",
    temperature: 0.7,
    max_tokens: 500,
    top_p: 0.95
  }
});

    
    if (isUnexpected(response)) {
      console.error("Unexpected response from API:", response.body.error);
      throw new Error(`API error: ${JSON.stringify(response.body.error)}`);
    }
    
    const messageContent = response.body.choices?.[0]?.message?.content;
    if (!messageContent || typeof messageContent !== 'string') {
      console.error("Invalid content in model response");
      throw new Error("Missing content in model response");
    }
    
    // Parse the response to extract question, options, and correct answer
    const parsedQuestion = parseResponse(messageContent);
    
    if (!parsedQuestion) {
      console.error("Failed to parse response into a valid question");
      throw new Error("Could not parse model response into a valid question");
    }
    
    return parsedQuestion;
    
  } catch (error) {
    console.error("Error generating question:", error);
    
    // Return a backup question
    console.log("Using backup question due to error");
    const backupQuestion = backupQuestions[backupIndex % backupQuestions.length];
    backupIndex = (backupIndex + 1) % backupQuestions.length;
    
    return { ...backupQuestion };
  }
} 