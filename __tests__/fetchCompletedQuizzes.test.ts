import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { jest } from '@jest/globals';

// Мок для Supabase ответа
const mockSupabaseResponse = {
  data: [
    {
      quizzes: { slug: 'quiz-1' }
    },
    {
      quizzes: { slug: 'quiz-2' }
    }
  ],
  error: null
};

// Мок для createServerComponentClient
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createServerComponentClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve(mockSupabaseResponse))
    }))
  }))
}));

async function fetchCompletedQuizzes(): Promise<string[]> {
    try {
      const supabase = createServerComponentClient({ cookies });
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('quizzes(slug)');
      
      if (error) throw error;
      
      // Проверяем, что quizzes является массивом
      const slugs = data.flatMap((item: { quizzes: { slug: string }[] | null }) => 
        Array.isArray(item.quizzes) ? item.quizzes.map(quiz => quiz.slug) : []
      );
      return slugs;
    } catch (error) {
      console.error('Error fetching completed quizzes:', error);
      return [];
    }
  }

describe('fetchCompletedQuizzes', () => {
  it('should return array of quiz slugs', async () => {
    const result = await fetchCompletedQuizzes();
    expect(result).toEqual(['quiz-1', 'quiz-2']);
  });
}); 