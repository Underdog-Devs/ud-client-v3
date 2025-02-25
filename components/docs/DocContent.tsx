'use client'

import React from 'react';
import { Box, Paper, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { 
  Home as HomeIcon, 
  ChevronRight as ChevronRightIcon, 
  MenuBook as MenuBookIcon
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import styles from './styles.module.scss';
import remarkGfm from 'remark-gfm';

interface DocContentProps {
  title: string;
  content: string;
  description?: string;
  visibility: 'public' | 'dashboard';
  publishedAt: string;
}

export function DocContent({ title, content, description, publishedAt }: DocContentProps) {
  return (
    <div className={styles.container}>
      <Breadcrumbs 
        separator={<ChevronRightIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        <Link href="/member-dashboard" passHref legacyBehavior>
          <MuiLink
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'text.primary',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
            Dashboard
          </MuiLink>
        </Link>
        <Link href="/member-dashboard/docs" passHref legacyBehavior>
          <MuiLink
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'text.primary',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            <MenuBookIcon sx={{ mr: 0.5 }} fontSize="small" />
            Documentation
          </MuiLink>
        </Link>
        <Typography color="text.secondary">
          {title}
        </Typography>
      </Breadcrumbs>

      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 },
          backgroundColor: 'background.paper',
          borderRadius: 2,
          border: 1,
          borderColor: 'divider'
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ textAlign: 'center', mb: 3 }}
        >
          {title}
        </Typography>

        {description && (
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ 
              textAlign: 'center',
              mb: 4
            }}
          >
            {description}
          </Typography>
        )}
        
        <Box className={styles.markdown}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Last Updated: {new Date(publishedAt).toLocaleDateString()}
          </Typography>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </Box>
      </Paper>
    </div>
  );
} 