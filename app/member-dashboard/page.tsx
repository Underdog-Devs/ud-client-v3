import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import styles from './dashboard.module.scss';
import fs from 'fs';
import path from 'path';
import { QuizCardMetadata, QuizCardUserMetadata, QuizCard } from '@/components/quiz/QuizCard';

async function fetchCompletedQuizzes(): Promise<string[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/quiz/completed`);
  const data = await response.json();
  const quizzes = data.items.map((quiz: { quizzes: { slug: string; }[] }) => quiz.quizzes.slug);
  return quizzes;
}

async function getQuizzes(role: string): Promise<QuizCardMetadata[]> {
  const testContentPath = path.join(process.cwd(), 'data', 'test-content');

  // Read all folders in the test-content directory
  const folders = fs.readdirSync(testContentPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  // Read the quiz metadata from each folder
  const quizzes = await Promise.all(folders.map(async (folder) => {
    const mainPath = path.join(testContentPath, folder, 'main.json');
    const main = fs.readFileSync(mainPath, 'utf8' );
    return JSON.parse(main) as QuizCardMetadata;
  }));

  quizzes.sort((a, b) => a.order - b.order);

  const completedQuizzes = await fetchCompletedQuizzes();

  const isQuizAvailable = (quiz: QuizCardMetadata, completedQuizzes: string[]) => {
    return (
      quiz.order === 1 || 
      completedQuizzes.includes(quiz.slug) || 
      quiz.order === completedQuizzes.length + 1
    );
  };

  const result = quizzes
    .filter(quiz => quiz.for.includes(role))
    .map(quiz => ({
      ...quiz,
      completed: completedQuizzes.includes(quiz.slug),
      available: isQuizAvailable(quiz, completedQuizzes)
    }));

  return result;
}

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const quizzes = await getQuizzes(user?.user_metadata?.role);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to dashboard, {user.email}</h1>
      <div className={styles.quizContainer}>
        {quizzes.map((quiz, index) => (
          <QuizCard {...quiz} key={index}/>
        ))}
      </div>
    </div>
  );
}
