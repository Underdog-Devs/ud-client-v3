import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import styles from './dashboard.module.scss';
import fs from 'fs';
import path from 'path';
import { QuizCardMetadata, QuizCardUserMetadata, QuizCard } from '@/components/quiz/QuizCard';


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

  const filteredQuizzes = quizzes.filter(quiz => quiz.for.includes(role));
  return filteredQuizzes;
}

// TODO: Get user data from supabase for card availability and completion status

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  const quizzes = await getQuizzes(user?.user_metadata?.role);

  if (!user) {
    return redirect('/login');
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to dashboard, {user.email}</h1>
      <div className={styles.quizContainer}>
        {quizzes.map((quiz) => (
          <QuizCard {...quiz} completed={false} available={true} />
        ))}
      </div>
    </div>
  );
}
