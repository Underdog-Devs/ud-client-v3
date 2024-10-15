// 'use server'

import React from 'react';
import fs from 'fs/promises';
import path from 'path';
import styles from './quiz.module.scss';
import { QuizPage } from '@/components/quiz/QuizPage';

async function importContent(slug: string) {
  const basePath = path.join(process.cwd(), 'data', 'test-content', slug);
  
  const articlePath = path.join(basePath, 'article.md');
  const quizPath = path.join(basePath, 'quiz.json');
  const mainPath = path.join(basePath, 'main.json');

  const article = await fs.readFile(articlePath, 'utf8');
  const quiz = await fs.readFile(quizPath, 'utf8');
  const main = await fs.readFile(mainPath, 'utf8');

  return {
    article,
    quiz: JSON.parse(quiz),
    main: JSON.parse(main)
  };
}

export default async function QuizBlock({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { article, quiz, main } = await importContent(slug);

  return (
    <div className={styles.quizPageContainer}>
      <h1 className={styles.title}>{main.title}</h1>
      <QuizPage markdownContent={article} quizQuestions={quiz} />
    </div>
  );
}
