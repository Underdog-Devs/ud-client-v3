'use client';

import React from 'react';
import styles from './dashboard.module.scss';
import { QuizCard, QuizCardMetadata } from '@/components/quiz/QuizCard';
import { Box, Typography } from '@mui/material';

interface QuizDashboardClientProps {
  quizzes: QuizCardMetadata[];
  userEmail: string | undefined;
}

export default function QuizDashboardClient({ quizzes, userEmail }: QuizDashboardClientProps) {
  return (
    <Box className={styles.container}>
      <Typography variant="h2" align="center">Onboarding</Typography>
      <Box className={styles.quizCardsContainer}>
        {quizzes.map((quiz, index) => (
          <QuizCard {...quiz} key={index}/>
        ))}
      </Box>
    </Box>
  );
}