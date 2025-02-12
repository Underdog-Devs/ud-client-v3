'use client'

import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, LinearProgress, Alert, Snackbar } from '@mui/material';
import { DocCard } from '@/components/quiz/QuizCard';
import { progressService, ArticleWithProgress } from '@/lib/api/progress';

export default function QuizDashboardClient() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<ArticleWithProgress[]>([]);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articlesWithProgress = await progressService.getAllArticlesWithProgress();
        setArticles(articlesWithProgress);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setNotification({
          open: true,
          message: 'Failed to load content. Please refresh the page.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {articles.map((article) => (
          <Grid item xs={12} key={article.id}>
            <DocCard 
              slug={article.slug}
              title={article.title}
              description=""
              available={article.is_available}
              completed={article.is_completed}
            />
          </Grid>
        ))}
      </Grid>

      {articles.length === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          border: 1,
          borderColor: 'divider'
        }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No articles available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please check back later for new content
          </Typography>
        </Box>
      )}

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}