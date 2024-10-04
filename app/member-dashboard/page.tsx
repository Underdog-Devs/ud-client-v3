import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import styles from './dashboard.module.scss';
import { testContent } from './test-content';
// Dummy data for quizzes and progress
const dummyQuizzes = [
  { id: 1, title: 'JavaScript Basics', progress: 75 },
  { id: 2, title: 'React Fundamentals', progress: 50 },
  { id: 3, title: 'CSS Flexbox', progress: 90 },
  { id: 4, title: 'Node.js Essentials', progress: 30 },
  { id: 5, title: 'Git Version Control', progress: 60 },
];

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
    console.log(testContent);
  if (!user) {
    return redirect('/login');
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to your dashboard, {user.email}</h1>
      <div className={styles.quizContainer}>
        {dummyQuizzes.map((quiz) => (
          <div key={quiz.id} className={styles.quizItem}>
            <h3>{quiz.title}</h3>
            <div className={styles.progressBar}>
              <div className={styles.progress} style={{ width: `${quiz.progress}%` }}></div>
            </div>
            <p>{quiz.progress}% Complete</p>
          </div>
        ))}
      </div>
    </div>
  );
}