"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Confetti } from "./components/confetti"
import { QuizQuestion } from "./components/quiz-question"
import type { QuizQuestion as QuizQuestionType } from "./utils/quiz-generator"

export default function QuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [questions, setQuestions] = useState<QuizQuestionType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQuestion = async () => {
    try {
      console.log('Fetching question from API...');
      const response = await fetch('/api/quiz', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          console.error('Failed to parse error response:', errorText);
          throw new Error(`Server error: ${response.status} - ${errorText || 'No response body'}`);
        }
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Question fetched successfully');
      return data;
    } catch (error) {
      console.error('Fetch question error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setError(null);
        const questionsToLoad = [];
        
        console.log('Starting to load questions...');
        // Load questions sequentially to avoid overwhelming the API
        for (let i = 0; i < 10; i++) {
          try {
            console.log(`Fetching question ${i + 1}...`);
            const question = await fetchQuestion();
            console.log(`Question ${i + 1} loaded successfully.`);
            questionsToLoad.push(question);
          } catch (error) {
            // Log detailed error information
            console.error(`Failed to load question ${i + 1}:`, {
              message: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            });
            
            // For network errors, add more specific information
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
              console.error('Network error detected. Check if the server is running and accessible.');
              throw new Error('Network error: Could not connect to the API. Please check your connection and try again.');
            }
            
            throw error; // Re-throw to be caught by outer try-catch
          }
        }

        if (questionsToLoad.length === 0) {
          throw new Error('No questions could be loaded');
        }

        console.log(`Loaded ${questionsToLoad.length} questions successfully.`);
        setQuestions(questionsToLoad);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load questions:', error);
        setError(error instanceof Error ? error.message : 'Failed to load questions');
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleAnswerClick = (answerId: string) => {
    setSelectedAnswer(answerId)
    const correct = answerId === questions[currentQuestion].correctAnswer
    setIsCorrect(correct)

    if (correct) {
      setScore(score + 1)
      setShowConfetti(true)
      const audio = new Audio("/sounds/correct.mp3")
      audio.play().catch((e) => console.log("Audio play failed:", e))
    } else {
      const audio = new Audio("/sounds/incorrect.mp3")
      audio.play().catch((e) => console.log("Audio play failed:", e))
    }

    setShowFeedback(true)

    setTimeout(() => {
      setShowFeedback(false)
      setShowConfetti(false)
      setSelectedAnswer("")

      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        setShowResult(true)
      }
    }, 2000)
  }

  const resetQuiz = async () => {
    setLoading(true);
    setError(null);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setShowFeedback(false);
    setIsCorrect(false);
    setSelectedAnswer("");
    
    try {
      const questionsToLoad = [];
      
      // Load questions sequentially
      for (let i = 0; i < 10; i++) {
        try {
          const question = await fetchQuestion();
          questionsToLoad.push(question);
        } catch (error) {
          console.error(`Failed to load question ${i + 1}:`, error);
          throw error;
        }
      }

      if (questionsToLoad.length === 0) {
        throw new Error('No questions could be loaded');
      }

      setQuestions(questionsToLoad);
    } catch (error) {
      console.error('Failed to load new questions:', error);
      setError(error instanceof Error ? error.message : 'Failed to load questions');
    }
    setLoading(false);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-yellow-300 p-4">
        <Card className="w-full max-w-md rounded-2xl shadow-lg border-0">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-2xl mb-4">❌</div>
              <p className="text-lg font-medium text-red-600 mb-4">{error}</p>
              <Button onClick={resetQuiz} className="rounded-xl font-medium">
                Try Again 🔄
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-yellow-300 p-4">
        <Card className="w-full max-w-md rounded-2xl shadow-lg border-0">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-2xl mb-4">🎲</div>
              <p className="text-lg font-medium">Loading questions...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-yellow-300 p-4">
      {showConfetti && <Confetti />}

      <Card className="w-full max-w-md rounded-2xl shadow-lg border-0">
        {!showResult ? (
          <>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold font-poppins">English Quiz</CardTitle>
                <div className="px-3 py-1 bg-primary/10 rounded-full text-sm font-medium">
                  Question {currentQuestion + 1}/{questions.length} 🎯
                </div>
              </div>
              <Progress value={(currentQuestion / questions.length) * 100} className="h-2 mt-2" />
            </CardHeader>

            <CardContent className="pt-4">
              {questions[currentQuestion] && questions[currentQuestion].options && (
                <QuizQuestion
                  question={questions[currentQuestion].question}
                  options={questions[currentQuestion].options}
                  selectedAnswer={selectedAnswer}
                  handleAnswerClick={handleAnswerClick}
                  showFeedback={showFeedback}
                  isCorrect={isCorrect}
                  correctAnswer={questions[currentQuestion].correctAnswer}
                />
              )}
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold font-poppins">Quiz Complete! 🎉</CardTitle>
              <CardDescription>
                Your score: {score}/{questions.length}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col items-center justify-center py-8">
              {score >= 8 ? (
                <div className="text-center">
                  <div className="text-6xl mb-4">🎓</div>
                  <h3 className="text-xl font-bold mb-2">You're an English Master!</h3>
                  <p>Incredible job! Your English skills are top-notch!</p>
                </div>
              ) : score >= 5 ? (
                <div className="text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-bold mb-2">Great job! Keep practicing!</h3>
                  <p>You're doing well, but there's still room to improve!</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-6xl mb-4">😊</div>
                  <h3 className="text-xl font-bold mb-2">Don't worry, English is fun!</h3>
                  <p>Try again! Practice makes perfect!</p>
                </div>
              )}
            </CardContent>

            <CardFooter>
              <Button onClick={resetQuiz} className="w-full rounded-xl font-medium text-base py-6">
                Try Again 🔄
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}

