import { strapiService, Article as StrapiArticle } from "./strapi";

export interface Article {
  id: string;
  title: string;
  content: string;
  slug: string;
  description?: string;
  is_completed?: boolean;
}

export interface ArticleWithRoles extends Article {
  roles: string;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const article = await strapiService.getArticle(slug);
    return {
      id: article.id,
      title: article.title,
      content: article.text,
      slug: article.slug,
      description: article.description,
    };
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

export async function getAllArticles(): Promise<ArticleWithRoles[]> {
  try {
    const docCards = await strapiService.getAllDocCards();
    return docCards.map((card) => ({
      id: card.id?.toString(),
      title: card.title,
      content: "", // Content is not available in doc cards
      slug: card.slug,
      description: card.description,
      roles: card.roles,
    }));
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}
