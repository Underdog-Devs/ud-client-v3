import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import styles from './dashboard.module.scss';
import fs from 'fs';
import path from 'path';

interface QuizMetadata {
  title: string;
  description: string;
  alt: string;
  slug: string;
  linkText: string;
  content: string;
  quiz: string;
}

async function getQuizzes(): Promise<QuizMetadata[]> {
  const testContentPath = path.join(process.cwd(), 'data', 'test-content');
  const folders = fs.readdirSync(testContentPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const quizzes = await Promise.all(folders.map(async (folder) => {
    const mainPath = path.join(testContentPath, folder, 'main.ts');
    const { default: quizData } = await import(`@/data/test-content/${folder}/main.ts`);
    return quizData as QuizMetadata;
  }));

  return quizzes;
}

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  const quizzes = await getQuizzes();

  if (!user) {
    return redirect('/login');
  }

  

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to dashboard, {user.email}</h1>
      <div className={styles.quizContainer}>
        {quizzes.map((quiz, index) => (
          <div key={index} className={styles.quizItem}>
            <h3>{quiz.title}</h3>
            <p>{quiz.description}</p>
            <Link href={`/member-dashboard/quiz/${quiz.slug}`} className={styles.quizLink}>
              {quiz.linkText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
