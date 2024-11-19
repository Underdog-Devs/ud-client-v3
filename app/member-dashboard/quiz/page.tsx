import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import QuizDashboardClient from '@/components/quiz/QuizDashboardClient';
import { getQuizzes } from '@/utils/quizUtils';

export default async function Quiz() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const quizzes = await getQuizzes(user?.user_metadata?.role);

  return <QuizDashboardClient quizzes={quizzes} userEmail={user.email} />;
}