"use client"

import React, { useState, useEffect } from 'react';
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
  const [currentQuestions, setCurrentQuestions] = useState<QuizProps['questions']>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [questionSetIndex, setQuestionSetIndex] = useState(0);

  useEffect(() => {
    setNextQuestionSet();
  }, [questionSetIndex]); // Добавляем зависимость

  const setNextQuestionSet = () => {
    const startIndex = questionSetIndex * 5;
    const endIndex = startIndex + 5;
    const newQuestions = questions.slice(startIndex, endIndex);
    setCurrentQuestions(newQuestions);
    setUserAnswers(new Array(newQuestions.length).fill(-1));
    setShowResults(false);
    setScore(0);
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    currentQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);

    const percentage = (correctAnswers / currentQuestions.length) * 100;
    if (percentage >= 70) {
      setPassed(true);
      alert("Test passed");
    } else {
      const nextSetIndex = questionSetIndex + 1;
      if (nextSetIndex * 5 < questions.length) {
        setQuestionSetIndex(nextSetIndex);
      } else {
        alert("Test failed")
      }
    }
  };

  return (
    <div className={styles.quizContainer}>
      <h2>Test</h2>
      {currentQuestions.map((q, index) => (
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
      {!showResults && !passed && (
        <button className={styles.submitButton} onClick={handleSubmit}>
          Send answers
        </button>
      )}
      {(showResults || passed) && (
        <div className={styles.results}>
          {passed ? (
            <p>You passed the test</p>
          ) : (
            <>
              <p>You have finished all questions. Try again.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
