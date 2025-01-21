import React from 'react';
import styles from './QuizQuestion.module.scss';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';

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
    <div>
      <h2 style={{ fontSize: "24px", color: "#000", marginBottom: "24px" }}>{question}</h2>
      <FormControl>
        <RadioGroup
          aria-labelledby="quiz-question"
          name="radio-buttons-group"
          sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
        >
          {options.map((option, index) => (
            <div key={index} className={styles.optionContainer}>
              <Radio
                checked={selectedAnswer === index}
                onChange={() => !showResult && onSelectAnswer(index)}
                value={option}
              />
              <p>{option}</p>
            </div>
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
};