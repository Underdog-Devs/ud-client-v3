"use client"
import React, { useState } from 'react';
import styles from './Quiz.module.scss';
import { QuizQuestion } from './QuizQuestion';

interface QuizProps {
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [userAnswers, setUserAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    setScore(correctAnswers);
    });

    const percentage = (correctAnswers / questions.length) * 100;
    if (percentage >= 80) {
      setPassed(true);
    }
    // setShowResults(true);
  };


  return (
    <div className={styles.quizContainer}>
      <h2>Quiz</h2>
      {questions.map((q, index) => (
        <QuizQuestion
          key={index}
          question={q.question}
          options={q.options}
          selectedAnswer={userAnswers[index]}
          onSelectAnswer={(answerIndex: number) => handleAnswerSelect(index, answerIndex)}
          showResult={showResults}
          correctAnswer={q.correctAnswer}
        />
      ))}
      {!showResults && (
        <button className={styles.submitButton} onClick={handleSubmit}>
          Submit Quiz
        </button>
      )}
      {showResults && (
        <div className={styles.results}>
          Your score: {score} out of {questions.length}
        </div>
      )}
    </div>
  );
};