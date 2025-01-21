import React, { useState } from 'react';
import { Quiz } from './Quiz';
import styles from './quizPage.module.scss';
import { MarkdownRenderer } from '../member-dashboard/MarkdownRenderer';

interface QuizPageProps {
  markdownContent: string;
  quizQuestions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
  slug: string;
  is_final: boolean;
}

export const QuizPage: React.FC<QuizPageProps> = ({ markdownContent, quizQuestions, slug, is_final }) => {
  return (
    <div className={styles.quizPageContainer}>
      <MarkdownRenderer content={markdownContent} />
      <Quiz questions={quizQuestions} slug={slug} is_final={is_final} />
    </div>
  );
};