'use client'

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Lock as LockIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import styles from './styles.module.scss';

interface ArticleCardProps {
  slug: string;
  title: string;
  description: string;
  available: boolean;
  completed: boolean;
}

export function ArticleCard({ slug, title, description, available, completed }: ArticleCardProps) {
  const getStatusChip = () => {
    if (completed) {
      return (
        <CheckCircleIcon />
      );
    }
    if (!available) {
      return (
        <LockIcon />
      );
    }
    return (
      <ArrowForwardIcon />
    );
  };

  return (
    <Link 
      href={available ? `/member-dashboard/onboarding/${slug}` : '#'} 
      className={styles.link}
      style={{ textDecoration: 'none' }}
    >
      <Card 
        className={styles.card}
        sx={{ 
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: available ? 'translateY(-4px)' : 'none',
            boxShadow: available ? 6 : 1
          }
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box flex={1}>
              <Typography variant="h6" component="h3" gutterBottom>
                {title}
              </Typography>
              {description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {description}
                </Typography>
              )}
            </Box>
            <Box ml={2}>
              {getStatusChip()}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
} 