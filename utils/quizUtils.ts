import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { QuizCardMetadata } from '@/components/quiz/QuizCard';

async function fetchCompletedQuizzes(): Promise<string[]> {
    try {
      const supabase = createServerComponentClient({ cookies });
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('quizzes:quiz_id(slug)');
      
      if (error) throw error;
      console.debug('Raw data:', data);
      
      if (!Array.isArray(data)) return [];
      
      const slugs = data
        .filter(item => item.quizzes)
        .map(item => item.quizzes.slug); // @ts-ignore
  
      console.debug('Processed slugs:', slugs);
      return slugs;
    } catch (error) {
      console.error('Detailed error:', error);
      throw new Error('Error fetching completed quizzes', { cause: error });
    }
  }

export async function getQuizzes(role: string): Promise<QuizCardMetadata[]> {
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