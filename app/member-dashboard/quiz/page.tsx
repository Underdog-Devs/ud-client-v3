import React from 'react';
import fs from 'fs';
import path from 'path';
import styles from './quiz.module.scss';
import { QuizPage } from '@/components/quiz/QuizPage';
import quizQuestions from '../test-content/what-is-ud-quiz';


export default function WhatIsUDQuiz() {
  // Read the markdown file
  const markdownPath = path.join(process.cwd(), 'app', 'member-dashboard', 'test-content', 'what-is-ud.md');
  const markdownContent = fs.readFileSync(markdownPath, 'utf8');

  return (
    <div className={styles.quizPageContainer}>
      <h1 className={styles.title}>What is Underdog Devs?</h1>
      <QuizPage markdownContent={markdownContent} quizQuestions={quizQuestions} />
    </div>
  );
}