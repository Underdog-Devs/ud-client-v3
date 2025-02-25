'use client'

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Link from 'next/link';

interface DocCardProps {
  slug: string;
  title: string;
  description: string;
  visibility: 'public' | 'dashboard';
}

export function DocCard({ slug, title, description }: DocCardProps) {
  return (
    <Link 
      href={`/member-dashboard/docs/${slug}`}
      style={{ textDecoration: 'none' }}
    >
      <Card 
        sx={{ 
          height: '100%',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          },
          cursor: 'pointer',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                {title}
              </Typography>
              {description && (
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
} 