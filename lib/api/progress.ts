import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getAllArticles, ArticleWithRoles } from './articles';

export interface Article {
  id: string;
  slug: string;
  title: string;
  roles: string[];
  description?: string;
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
    const { data: { user }, error: userError } = await this.supabase.auth.getUser();
    if (userError || !user) {
      throw userError || new Error('User not found');
    }

    // 1. Get articles from Strapi
    const userRole = user.user_metadata.role;
    const strapiArticles = await getAllArticles();
    const filteredArticles = strapiArticles.filter(item => 
      item.roles.includes("all") || item.roles.includes(userRole)
    );

    // 2. Get Supabase article IDs
    const { data: supabaseArticles, error: articlesError } = await this.supabase
      .from('articles')
      .select('id, slug');

    if (articlesError) {
      console.error('Error fetching Supabase articles:', articlesError);
      throw articlesError;
    }

    // Create map of slug to Supabase ID
    const slugToIdMap = new Map(
      supabaseArticles?.map(article => [article.slug, article.id]) || []
    );

    // 3. Get progress for all articles
    const { data: progress, error: progressError } = await this.supabase
      .from('user_article_progress')
      .select('*')
      .eq('user_id', user.id);

    if (progressError) {
      console.error('Error fetching progress:', progressError);
      throw progressError;
    }

    // Create map of article ID to progress
    const progressMap = new Map(
      progress?.map(p => [p.article_id, p.completed]) || []
    );

    // 4. Map articles with progress
    const result = filteredArticles.map((article, index) => {
      const supabaseId = slugToIdMap.get(article.slug);
      const isCompleted = supabaseId ? !!progressMap.get(supabaseId) : false;
      
      let isAvailable = index === 0;
      if (index > 0) {
        const prevArticle = filteredArticles[index - 1];
        const prevArticleId = slugToIdMap.get(prevArticle.slug);
        isAvailable = prevArticleId ? !!progressMap.get(prevArticleId) : false;
      }

      return {
        ...article,
        roles: Array.isArray(article.roles) ? article.roles : [article.roles],
        is_completed: isCompleted,
        is_available: isAvailable
      };
    });

    return result;
  }

  async markArticleAsCompleted(articleSlug: string, userId: string): Promise<void> {

    // Get article ID by slug
    const { data: article, error: articleError } = await this.supabase
      .from('articles')
      .select('id')
      .eq('slug', articleSlug)
      .single();

    if (articleError || !article) {
      console.error('Error finding article:', articleError);
      throw articleError;
    }

    // Update or insert progress
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
    const { data, error } = await this.supabase
      .rpc('is_article_available', {
        p_user_id: userId,
        p_article_slug: articleSlug
      });

    if (error) {
      console.error('Error checking article availability:', error);
      return false;
    }
    return data || false;
  }
}

export const progressService = new ProgressService(); 