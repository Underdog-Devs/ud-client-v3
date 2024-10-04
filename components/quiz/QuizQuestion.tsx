import React from 'react';
import styles from './QuizQuestion.module.scss';

interface QuizQuestionProps {
  question: string;
  options: string[];
  selectedAnswer: number;
  onSelectAnswer: (index: number) => void;
  showResult: boolean;
  correctAnswer: number;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  options,
  selectedAnswer,
  onSelectAnswer,
  showResult,
  correctAnswer,
}) => {
  return (
    <div className={styles.questionContainer}>
      <h3>{question}</h3>
      <ul>
        {options.map((option, index) => (
          <li
            key={index}
            className={`${styles.option} ${
              selectedAnswer === index ? styles.selected : ''
            } ${
              showResult
                ? index === correctAnswer
                  ? styles.correct
                  : selectedAnswer === index
                  ? styles.incorrect
                  : ''
                : ''
            }`}
            onClick={() => !showResult && onSelectAnswer(index)}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};