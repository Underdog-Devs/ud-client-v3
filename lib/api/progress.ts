import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export interface Article {
  id: string;
  slug: string;
  title: string;
  order_index: number;
}

export interface ArticleProgress {
  id: string;
  user_id: string;
  article_id: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface ArticleWithProgress extends Article {
  is_available: boolean;
  is_completed: boolean;
}

class ProgressService {
  private supabase = createClientComponentClient();

  async getArticleProgress(articleId: string): Promise<ArticleProgress | null> {
    const { data: progress, error } = await this.supabase
      .from('user_article_progress')
      .select('*')
      .eq('article_id', articleId)
      .single();

    if (error) {
      console.error('Error fetching article progress:', error);
      return null;
    }

    return progress;
  }

  async getAllArticlesWithProgress(): Promise<ArticleWithProgress[]> {
    const { data: articles, error: articlesError } = await this.supabase
      .from('articles')
      .select('*')
      .order('order_index');

    if (articlesError) {
      console.error('Error fetching articles:', articlesError);
      throw articlesError;
    }

    const { data: progress, error: progressError } = await this.supabase
      .from('user_article_progress')
      .select('*');

    if (progressError) {
      console.error('Error fetching progress:', progressError);
      throw progressError;
    }

    const progressMap = new Map(progress?.map(p => [p.article_id, p]));

    return articles.map(article => {
      const articleProgress = progressMap.get(article.id);
      return {
        ...article,
        is_completed: articleProgress?.completed || false,
        is_available: article.order_index === 1 || 
          progressMap.get(articles.find(a => a.order_index === article.order_index - 1)?.id)?.completed || false
      };
    });
  }

  async markArticleAsCompleted(articleSlug: string, userId: string): Promise<void> {
    // First get article ID by slug
    const { data: article, error: articleError } = await this.supabase
      .from('articles')
      .select('id')
      .eq('slug', articleSlug)
      .single();

    if (articleError || !article) {
      console.error('Error finding article:', articleError);
      throw articleError;
    }

    const { error } = await this.supabase
      .from('user_article_progress')
      .upsert({
        article_id: article.id,
        user_id: userId,
        completed: true,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,article_id'
      });

    if (error) {
      console.error('Error marking article as completed:', error);
      throw error;
    }
  }

  async isArticleAvailable(articleSlug: string, userId: string): Promise<boolean> {
    console.log('articleSlug', articleSlug);
    console.log('userId', userId);

    const { data, error } = await this.supabase
      .rpc('is_article_available', {
        p_user_id: userId,
        p_article_slug: articleSlug
      });

    console.log('data', data);

    if (error) {
      console.error('Error checking article availability:', error);
      return false;
    }

    return data || false;
  }
}

export const progressService = new ProgressService(); 