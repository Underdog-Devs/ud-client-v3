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
            <div 
              key={index} 
              className={styles.optionContainer}
              onClick={() => !showResult && onSelectAnswer(index)}
              style={{ 
                cursor: !showResult ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <Radio
                checked={selectedAnswer === index}
                onChange={() => !showResult && onSelectAnswer(index)}
                value={option}
              />
              <p style={{ 
                userSelect: 'none',
                flexGrow: 1,
                margin: 0,
                padding: '8px 0'
              }}>{option}</p>
            </div>
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
};