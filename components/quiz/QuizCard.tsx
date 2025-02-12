'use client'

import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import Link from 'next/link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export interface DocCardMetadata {
  slug: string;
  title: string;
  description: string;
  available?: boolean;
  completed?: boolean;
}

export function DocCard({ slug, title, description, available = true, completed = false }: DocCardMetadata) {
  return (
    <Link 
      href={available ? `/member-dashboard/onboarding/${slug}` : '#'} 
      style={{ textDecoration: 'none' }}
    >
      <Card 
        sx={{ 
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          opacity: available ? 1 : 0.7,
          '&:hover': available ? {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          } : {},
          cursor: available ? 'pointer' : 'not-allowed',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" component="div" color="text.primary">
              {title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {completed ? (
                <Chip 
                  icon={<CheckCircleIcon />} 
                  label="Completed" 
                  color="success" 
                  size="small"
                />
              ) : !available ? (
                <Chip 
                  icon={<LockIcon />} 
                  label="Locked" 
                  color="default" 
                  size="small"
                />
              ) : (
                <Chip 
                  icon={<ArrowForwardIcon />} 
                  label="Start Reading" 
                  color="primary" 
                  size="small"
                />
              )}
            </Box>
          </Box>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
