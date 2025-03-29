import { NextResponse } from 'next/server';
import { generateQuizQuestion } from '@/app/utils/quiz-generator';

// Add Vercel runtime config to increase timeout
export const runtime = 'edge'; // Use edge runtime for better performance
export const maxDuration = 60; // Max 60 seconds runtime

export async function GET() {
  console.log('Quiz API route called');
  
  try {
    // Check for GitHub token
    if (!process.env.GITHUB_TOKEN) {
      console.error('GITHUB_TOKEN is not configured');
      return NextResponse.json(
        { error: 'GitHub token not configured. Please set the GITHUB_TOKEN environment variable.' },
        { status: 500 }
      );
    }

    console.log('Generating quiz question...');
    const question = await generateQuizQuestion();
    console.log('Question generated:', !!question);
    
    // Validate the question structure before sending
    if (!question || !question.question || !question.options || !question.correctAnswer) {
      const errorDetails = {
        hasQuestion: !!question?.question,
        hasOptions: !!question?.options,
        hasCorrectAnswer: !!question?.correctAnswer,
        receivedStructure: question ? JSON.stringify(question, null, 2) : 'null'
      };
      console.error('Invalid question generated:', errorDetails);
      return NextResponse.json(
        { 
          error: 'Generated question is invalid',
          details: errorDetails
        },
        { status: 500 }
      );
    }

    console.log('Returning question successfully');
    return NextResponse.json(question);
  } catch (error) {
    console.error('Error in quiz API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate question';
    
    return NextResponse.json(
      { 
        error: errorMessage
      },
      { status: 500 }
    );
  }
} 