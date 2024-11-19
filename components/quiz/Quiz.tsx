"use client"

import React, { useState, useEffect } from 'react';
import styles from './Quiz.module.scss';
import { QuizQuestion } from './QuizQuestion';
import { Alert, Link, Snackbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface QuizProps {
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
  slug: string;
  is_final: boolean;
}

export function ProgressMobileStepper() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <MobileStepper
      variant="progress"
      steps={6}
      position="static"
      activeStep={activeStep}
      sx={{ maxWidth: 400, flexGrow: 1 }}
      nextButton={
        <Button size="small" onClick={handleNext} disabled={activeStep === 5}>
          Next
          {theme.direction === 'rtl' ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </Button>
      }
      backButton={
        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
          {theme.direction === 'rtl' ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
          Back
        </Button>
      }
    />
  );
}


export const Quiz: React.FC<QuizProps> = ({ questions, slug, is_final }) => {

  console.debug(is_final);

  const theme = useTheme();

  const [activeStep, setActiveStep] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState(questions.slice(0, 5));
  const [userAnswers, setUserAnswers] = useState<number[]>(new Array(5).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleNext = () => {
    if (activeStep < currentQuestions.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[activeStep] = answerIndex;
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

    const percentage = (correctAnswers / 5) * 100;
    
    if (percentage >= 70) {
      if (is_final) {
        const supabase = createClientComponentClient();
        supabase.auth.updateUser({
          data: { completed_onboarding_quiz: true }
        });
      }

      setPassed(true);
      fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/quiz/completed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      });
    } else {
      // setAttemptCount(prev => prev + 1);
      
      
      // Показать следующие 5 вопросов при неудаче
      const nextStartIndex = ((attemptCount + 1) * 5) % questions.length;
      const nextQuestions = questions.slice(nextStartIndex, nextStartIndex + 5);
      setCurrentQuestions(nextQuestions);
      setUserAnswers(new Array(5).fill(-1));
      setActiveStep(0);
      setShowResults(false);

      setTimeout(() => {
        setShowSnackbar(true);
      }, 1000);
    }
  };

  if (passed) {
    return <Alert severity="success">Test passed. Go back to <Link href="/member-dashboard">dashboard</Link></Alert>;
  }
  else if (showResults) {
    return <Alert severity="error">Test failed. Try again.</Alert>;
  }

  return (
    <div className={styles.quizContainer}>
      <h2>Test</h2>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => {}}
        message="Test failed. Trying again."
        action={<></>}
      />
      <QuizQuestion
        question={currentQuestions[activeStep].question}
        options={currentQuestions[activeStep].options}
        selectedAnswer={userAnswers[activeStep]}
        onSelectAnswer={handleAnswerSelect}
        showResult={showResults}
        correctAnswer={currentQuestions[activeStep].correctAnswer}
      />
      <MobileStepper
        variant="progress"
        steps={5}
        position="static"
        activeStep={activeStep}
        sx={{ maxWidth: 400, flexGrow: 1, margin: '0 auto' }}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === 5}>
            {activeStep === 4 ? 'Finish' : 'Next'}
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
    </div>
  );
};