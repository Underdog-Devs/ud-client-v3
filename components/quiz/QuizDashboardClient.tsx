'use client';

import React from 'react';
import styles from './dashboard.module.scss';
import { QuizCard, QuizCardMetadata } from '@/components/quiz/QuizCard';

interface QuizDashboardClientProps {
  quizzes: QuizCardMetadata[];
  userEmail: string | undefined;
}

export default function QuizDashboardClient({ quizzes, userEmail }: QuizDashboardClientProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to dashboard, {userEmail}</h1>
      <div className={styles.quizContainer}>
        {quizzes.map((quiz, index) => (
          <QuizCard {...quiz} key={index}/>
        ))}
      </div>
    </div>
  );
}