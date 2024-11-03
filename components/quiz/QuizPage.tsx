import React from 'react';
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
}

export const QuizPage: React.FC<QuizPageProps> = ({ markdownContent, quizQuestions, slug }) => {
  return (
    <div className={styles.quizPageContainer}>
      <MarkdownRenderer content={markdownContent} />
      <Quiz questions={quizQuestions} slug={slug} />
    </div>
  );
};