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
  data: {
    articles: {
      id: number;
      slug: string;
      title: string;
      description: string;
      roles: string;
    }[];
  };
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
  id: number;
  slug: string;
  title: string;
  description: string;
  roles: string;
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
      const response = await strapiAPI.get<Article>(
        `/api/articles?filters[slug][$eq]=${slug}&populate=*`
      );

      const articleData: Article = response.data.data[0];
      return {
        title: articleData.title,
        description: articleData.description,
        text: articleData.text,
        slug: articleData.slug,
        id: articleData.id,
      };
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

      let data = response.data.data.articles.map((article) => ({
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
}

export const strapiService = new StrapiService();
