// // "use client"

// // import { motion } from "framer-motion"
// // import { Button } from "@/components/ui/button"
// // import { CheckCircle, XCircle } from "lucide-react"

// // interface QuizQuestionProps {
// //   question: string
// //   options: { id: string; text: string }[]
// //   selectedAnswer: string
// //   handleAnswerClick: (answerId: string) => void
// //   showFeedback: boolean
// //   isCorrect: boolean
// //   correctAnswer: string
// // }

// // export function QuizQuestion({
// //   question,
// //   options = [],
// //   selectedAnswer = "",
// //   handleAnswerClick,
// //   showFeedback = false,
// //   isCorrect = false,
// //   correctAnswer = "",
// // }: QuizQuestionProps) {
// //   if (!options || options.length === 0) {
// //     return null;
// //   }

// //   return (
// //     <div className="space-y-6">
// //       <h2 className="text-xl font-semibold font-poppins">{question}</h2>

// //       <div className="space-y-3">
// //         {options.map((option) => (
// //           <motion.div key={option.id} whileHover={{ scale: selectedAnswer ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}>
// //             <Button
// //               variant="outline"
// //               className={`w-full min-h-[4rem] justify-start text-left p-4 font-normal text-base rounded-xl border-2 ${
// //                 selectedAnswer === option.id
// //                   ? option.id === correctAnswer
// //                     ? "border-green-500 bg-green-50"
// //                     : "border-red-500 bg-red-50"
// //                   : option.id === correctAnswer && showFeedback
// //                     ? "border-green-500 bg-green-50"
// //                     : "border-gray-200"
// //               }`}
// //               onClick={() => !selectedAnswer && handleAnswerClick(option.id)}
// //               disabled={!!selectedAnswer}
// //             >
// //               <div className="flex items-start w-full gap-3">
// //                 <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full border-2 border-current">
// //                   {option.id}
// //                 </div>
// //                 <span className="flex-grow break-words">{option.text}</span>
// //                 {selectedAnswer === option.id && option.id === correctAnswer && (
// //                   <CheckCircle className="flex-shrink-0 ml-2 h-5 w-5 text-green-500" />
// //                 )}
// //                 {selectedAnswer === option.id && option.id !== correctAnswer && (
// //                   <XCircle className="flex-shrink-0 ml-2 h-5 w-5 text-red-500" />
// //                 )}
// //               </div>
// //             </Button>
// //           </motion.div>
// //         ))}
// //       </div>

// //       {showFeedback && (
// //         <motion.div
// //           initial={{ opacity: 0, y: 10 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           className={`p-4 rounded-xl text-center font-medium ${
// //             isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
// //           }`}
// //         >
// //           {isCorrect ? (
// //             <p className="flex items-center justify-center gap-2">
// //               <CheckCircle className="h-5 w-5" /> Awesome! 🎉 You got it right!
// //             </p>
// //           ) : (
// //             <p className="flex items-center justify-center gap-2">
// //               <XCircle className="h-5 w-5" /> Oops! 🤔 Try again next time!
// //             </p>
// //           )}
// //         </motion.div>
// //       )}
// //     </div>
// //   )
// // }

// "use client"

// import { motion } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { CheckCircle, XCircle } from "lucide-react"

// interface QuizQuestionProps {
//   question: string
//   options: { [key: string]: string } | { id: string; text: string }[]
//   selectedAnswer: string
//   handleAnswerClick: (answerId: string) => void
//   showFeedback: boolean
//   isCorrect: boolean
//   correctAnswer: string
// }

// export function QuizQuestion({
//   question,
//   options = [],
//   selectedAnswer = "",
//   handleAnswerClick,
//   showFeedback = false,
//   isCorrect = false,
//   correctAnswer = "",
// }: QuizQuestionProps) {
//   // Handle both object and array formats for options
//   const processedOptions = Array.isArray(options)
//     ? options
//     : Object.entries(options).map(([id, text]) => ({ id, text }));

//   if (!processedOptions || processedOptions.length === 0) {
//     return null;
//   }

//   return (
//     <div className="space-y-6">
//       <h2 className="text-xl font-semibold font-poppins">{question}</h2>

//       <div className="space-y-3">
//         {processedOptions.map((option) => (
//           <motion.div key={option.id} whileHover={{ scale: selectedAnswer ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}>
//             <Button
//               variant="outline"
//               className={`w-full min-h-[4rem] h-auto justify-start text-left p-4 font-normal text-base rounded-xl border-2 ${
//                 selectedAnswer === option.id
//                   ? option.id === correctAnswer
//                     ? "border-green-500 bg-green-50"
//                     : "border-red-500 bg-red-50"
//                   : option.id === correctAnswer && showFeedback
//                     ? "border-green-500 bg-green-50"
//                     : "border-gray-200"
//               }`}
//               onClick={() => !selectedAnswer && handleAnswerClick(option.id)}
//               disabled={!!selectedAnswer}
//             >
//               <div className="flex items-start w-full gap-3">
//                 <div className="flex-shrink-0 mt-0.5 h-6 w-6 flex items-center justify-center rounded-full border-2 border-current">
//                   {option.id}
//                 </div>
//                 <span className="flex-grow break-words leading-normal">{option.text}</span>
//                 {selectedAnswer === option.id && option.id === correctAnswer && (
//                   <CheckCircle className="flex-shrink-0 ml-2 h-5 w-5 text-green-500" />
//                 )}
//                 {selectedAnswer === option.id && option.id !== correctAnswer && (
//                   <XCircle className="flex-shrink-0 ml-2 h-5 w-5 text-red-500" />
//                 )}
//               </div>
//             </Button>
//           </motion.div>
//         ))}
//       </div>

//       {showFeedback && (
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className={`p-4 rounded-xl text-center font-medium ${
//             isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//           }`}
//         >
//           {isCorrect ? (
//             <p className="flex items-center justify-center gap-2">
//               <CheckCircle className="h-5 w-5" /> Awesome! 🎉 You got it right!
//             </p>
//           ) : (
//             <p className="flex items-center justify-center gap-2">
//               <XCircle className="h-5 w-5" /> Oops! 🤔 Try again next time!
//             </p>
//           )}
//         </motion.div>
//       )}
//     </div>
//   )
// }

// export default QuizQuestion


"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"

interface QuizQuestionProps {
  question: string
  options: { [key: string]: string } | { id: string; text: string }[]
  selectedAnswer: string
  handleAnswerClick: (answerId: string) => void
  showFeedback: boolean
  isCorrect: boolean
  correctAnswer: string
}

export function QuizQuestion({
  question,
  options = [],
  selectedAnswer = "",
  handleAnswerClick,
  showFeedback = false,
  isCorrect = false,
  correctAnswer = "",
}: QuizQuestionProps) {
  // Handle both object and array formats for options
  const processedOptions = Array.isArray(options)
    ? options
    : Object.entries(options).map(([id, text]) => ({ id, text }))

  if (!processedOptions || processedOptions.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold font-poppins">{question}</h2>

      <div className="space-y-3">
        {processedOptions.map((option) => (
          <motion.div key={option.id} whileHover={{ scale: selectedAnswer ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              className={`w-full min-h-[4rem] h-auto justify-start text-left p-4 font-normal text-base rounded-xl border-2 ${
                selectedAnswer === option.id
                  ? option.id === correctAnswer
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                  : option.id === correctAnswer && showFeedback
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200"
              }`}
              onClick={() => !selectedAnswer && handleAnswerClick(option.id)}
              disabled={!!selectedAnswer}
            >
              <div className="flex items-start w-full gap-3">
                <div className="flex-shrink-0 mt-0.5 h-6 w-6 flex items-center justify-center rounded-full border-2 border-current">
                  {option.id}
                </div>
                {/* Added max-h and overflow-y-auto to contain long answers */}
                <span className="flex-grow break-words leading-normal max-h-20 overflow-y-auto">
                  {option.text}
                </span>
                {selectedAnswer === option.id && option.id === correctAnswer && (
                  <CheckCircle className="flex-shrink-0 ml-2 h-5 w-5 text-green-500" />
                )}
                {selectedAnswer === option.id && option.id !== correctAnswer && (
                  <XCircle className="flex-shrink-0 ml-2 h-5 w-5 text-red-500" />
                )}
              </div>
            </Button>
          </motion.div>
        ))}
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl text-center font-medium ${
            isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isCorrect ? (
            <p className="flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5" /> Awesome! 🎉 You got it right!
            </p>
          ) : (
            <p className="flex items-center justify-center gap-2">
              <XCircle className="h-5 w-5" /> Oops! 🤔 Try again next time!
            </p>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default QuizQuestion
