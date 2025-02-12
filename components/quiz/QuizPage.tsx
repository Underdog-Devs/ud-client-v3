'use client'

import React from 'react';
import styles from './quiz.module.scss';
import ReactMarkdown from 'react-markdown';
import { Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { progressService } from '@/lib/api/progress';

export interface QuizPageProps {
  markdownContent: string;
  quizQuestions: any[];
  slug: string;
  is_final: boolean;
  userId: string;
}

export function QuizPage({ markdownContent, quizQuestions, slug, is_final, userId }: QuizPageProps) {
  const router = useRouter();

  const handleComplete = async () => {
    try {
      await progressService.markArticleAsCompleted(slug, userId);
      router.push('/member-dashboard/onboarding');
    } catch (error) {
      console.error('Error completing article:', error);
    }
  };

  return (
    <div className={styles.quizContainer}>
      <ReactMarkdown>{markdownContent}</ReactMarkdown>
      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleComplete}
        >
          Complete and Continue
        </Button>
      </Box>
    </div>
  );
}