import React from 'react';
import { Container } from '@mui/material';
import { ArticleContent } from '@/components/dashboard/ArticleContent';
import { getArticleBySlug } from '@/lib/api/articles';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);

  console.log(article);

  if (!article) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <ArticleContent 
        title={article.title}
        content={article.content}
        slug={params.slug}
      />
    </Container>
  );
}
