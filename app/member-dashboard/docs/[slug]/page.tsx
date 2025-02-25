import React from 'react';
import { Container } from '@mui/material';
import { DocContent } from '@/components/docs/DocContent';
import { strapiService } from '@/lib/api/strapi';

interface DocPageProps {
  params: {
    slug: string;
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const doc = await strapiService.getDocBySlug(params.slug);

  if (!doc) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <DocContent 
        title={doc.title}
        content={doc.content}
        description={doc.description}
        visibility={doc.visibility}
        publishedAt={doc.publishedAt}
      />
    </Container>
  );
} 