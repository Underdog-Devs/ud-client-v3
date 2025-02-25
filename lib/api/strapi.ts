import axios from "axios";
import { getUserRole } from "@/lib/api/supabase";

const strapiAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add authorization token to requests if available
strapiAPI.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface DocCard {
  id: string;
  slug: string;
  title: string;
  description: string;
  visibility: 'public' | 'dashboard';
}

export interface Doc {
  id: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  visibility: 'public' | 'dashboard';
  publishedAt: string;
}

export interface Article {
  title: string;
  description: string;
  text: string;
  slug: string;
  id: string;
}

class StrapiService {
  async getArticle(slug: string): Promise<Article> {
    try {
      const response = await strapiAPI.get<{ data: Article[] }>(
        `/api/articles?filters[slug][$eq]=${slug}&populate=*`
      );

      const articleData: Article = response.data.data[0];
      return articleData;
    } catch (error) {
      console.error("Error fetching quiz content:", error);
      throw error;
    }
  }

  async getAllDocCards(): Promise<DocCard[]> {
    try {
      const response = await strapiAPI.get<StrapiResponse<DocCard>>(
        "/api/article-list?populate[articles][fields]=title,description,slug,roles"
      );

      const data = response.data.data.articles.map((article) => ({
        id: article.id.toString(),
        slug: article.slug.toString(),
        title: article.title.toString(),
        description: article.description.toString(),
        roles: article.roles.toString(),
      }));

      return data;
    } catch (error) {
      console.error("Error fetching all doc cards:", error);
      throw error;
    }
  }

  async getAllDocs(): Promise<DocCard[]> {
    try {
      const response = await strapiAPI.get<StrapiResponse<DocCard>>(
        "/api/docs?populate=*"
      );

      return response.data.data.map(doc => ({
        id: doc.id.toString(),
        slug: doc.slug,
        title: doc.title,
        description: doc.description,
        visibility: doc.visibility
      }));
    } catch (error) {
      console.error("Error fetching docs:", error);
      throw error;
    }
  }

  async getDocBySlug(slug: string): Promise<Doc | null> {
    try {
      const response = await strapiAPI.get<StrapiResponse<Doc>>(
        `/api/docs?filters[slug][$eq]=${slug}&populate=*`
      );

      if (response.data.data.length === 0) {
        return null;
      }

      const doc = response.data.data[0];
      return {
        id: doc.id.toString(),
        title: doc.title,
        description: doc.description,
        content: doc.content,
        slug: doc.slug,
        visibility: doc.visibility,
        publishedAt: doc.publishedAt
      };
    } catch (error) {
      console.error("Error fetching doc:", error);
      return null;
    }
  }
}

export const strapiService = new StrapiService();
