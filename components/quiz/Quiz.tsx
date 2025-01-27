"use client"

import React, { useState, useEffect } from 'react';
import styles from './quiz.module.scss';
import { QuizQuestion } from './QuizQuestion';
import { Alert, Link, Snackbar } from '@mui/material';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { duration, useTheme } from '@mui/material/styles';
import Confetti from 'react-confetti-boom';
import { Typography } from '@mui/material';

interface QuizProps {
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
  slug: string;
  is_final: boolean;
}

export const Quiz: React.FC<QuizProps> = ({ questions, slug, is_final }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState(questions.slice(0, 5));
  const [userAnswers, setUserAnswers] = useState<number[]>(new Array(5).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleNext = () => {
    if (activeStep < currentQuestions.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      console.log("activeStep", activeStep);
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
          data: { completed_onboarding_quiz: false }
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
    }
    else {
      // setAttemptCount(prev => prev + 1); 
      setFinished(true);
      // Show another 5 questions when failed
      // const nextStartIndex = ((attemptCount + 1) * 5) % questions.length;
      // const nextQuestions = questions.slice(nextStartIndex, nextStartIndex + 5);
      // setCurrentQuestions(nextQuestions);
      // setUserAnswers(new Array(5).fill(-1));
      // setActiveStep(0);
      // setShowResults(false);
    }
  };

  useEffect(() => {
    if (showResults) {
      setFinished(true);
    }
  }, [showResults]);

  if (passed) {
    return (
      <>
        <Alert severity="success">
          Test passed. Go back to <Link href="/member-dashboard/onboarding">dashboard</Link>
        </Alert>
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          <Confetti mode="boom" />
        </div>
      </>
    );
  }
  else if (finished) {
    return (
      <Alert severity="error" action={
        <Button color="inherit" size="small" onClick={() => {
          setFinished(false);
          setShowResults(false);
          setActiveStep(0);
          setUserAnswers(new Array(5).fill(-1));
          const nextStartIndex = Math.floor(Math.random() * (questions.length - 4));
          setCurrentQuestions(questions.slice(nextStartIndex, nextStartIndex + 5));
        }}>
          Try Again
        </Button>
      }>
        Test failed
      </Alert>
    );
  }

  return (
    <div>
      <Typography variant="h4" sx={{ fontSize: "24px", color: "#000", marginY: "24px", textAlign: "center" }}>Now let's test your knowledge!</Typography>
      <div className={styles.quizContainer}>
        <MobileStepper
          variant="dots"
          steps={5}
          position="static"
          activeStep={activeStep}
        sx={{ flexGrow: 1, width: "100%", margin: "0 auto", marginBottom: "20px", marginTop: "0px", backgroundColor: "transparent", padding: "0px" }}
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
      <QuizQuestion
        question={currentQuestions[activeStep].question}
        options={currentQuestions[activeStep].options}
        selectedAnswer={userAnswers[activeStep]}
        onSelectAnswer={handleAnswerSelect}
        showResult={showResults}
          correctAnswer={currentQuestions[activeStep].correctAnswer}
        />
      </div>
    </div>
  );
};