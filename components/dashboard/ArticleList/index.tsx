'use client'

import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, LinearProgress, Alert, Snackbar, Button, Collapse, Paper } from '@mui/material';
import { ArticleCard } from '../ArticleCard';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { BugReport as BugReportIcon } from '@mui/icons-material';
import styles from './styles.module.scss';
import { progressService, ArticleWithProgress } from '@/lib/api/progress';

export function ArticleList() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<ArticleWithProgress[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const supabase = createClientComponentClient();

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

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const resetProgress = async () => {
    setResetting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_article_progress')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setNotification({
        open: true,
        message: 'Progress has been reset successfully',
        severity: 'success'
      });

      await fetchArticles();
    } catch (error) {
      console.error('Error resetting progress:', error);
      setNotification({
        open: true,
        message: 'Failed to reset progress',
        severity: 'error'
      });
    } finally {
      setResetting(false);
    }
  };

  const sendSlackInvite = async () => {
    setInviting(true);
    try {
      const response = await fetch('/api/slack/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation');
      }

      setNotification({
        open: true,
        message: 'Success! Wait for invitation in your email',
        severity: 'success'
      });
      
      setInviting(true);
    } catch (error: any) {
      console.error('Error sending Slack invitation:', error);
      setNotification({
        open: true,
        message: error.message || 'Failed to send Slack invitation. Please try again.',
        severity: 'error'
      });
      setInviting(false);
    }
  };

  const allArticlesCompleted = articles.length > 0 && articles.every(article => article.is_completed);

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <div className={styles.container}>
      <Grid container spacing={3}>
        {articles.map((article) => (
          <Grid item xs={12} key={article.slug}>
            <ArticleCard 
              slug={article.slug}
              title={article.title}
              description={article.description || ''}
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

      {allArticlesCompleted && (
        <Box sx={{ 
          mt: 4, 
          textAlign: 'center',
          p: 4,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          border: 1,
          borderColor: 'success.main'
        }}>
          <Typography variant="h6" color="success.main" gutterBottom>
            🎉 Congratulations! You've completed all articles!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Join our Slack community to continue your journey
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={sendSlackInvite}
            disabled={inviting}
            sx={{
              py: 1.5,
              px: 4,
              backgroundColor: '#4A154B',
              '&:hover': {
                backgroundColor: '#3a1139'
              }
            }}
          >
            {inviting ? 'Request sent' : 'Apply to Slack Community'}
          </Button>
        </Box>
      )}

      {/* Debug Section */}
      {isDevelopment && <Box sx={{ mt: 4 }}>
        <Button
          startIcon={<BugReportIcon />}
          onClick={() => setShowDebug(!showDebug)}
          sx={{ 
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary'
            }
          }}
        >
          Debug Tools
        </Button>
        <Collapse in={showDebug}>
          <Paper 
            sx={{ 
              mt: 2, 
              p: 2, 
              backgroundColor: 'action.hover',
              border: 1,
              borderColor: 'divider'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Debug Actions
            </Typography>
            <Button
              variant="outlined"
              color="warning"
              disabled={resetting}
              onClick={resetProgress}
              sx={{ mt: 1 }}
            >
              Reset Reading Progress
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
              This will reset all your reading progress. Use with caution!
            </Typography>
          </Paper>
          </Collapse>
        </Box>}

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
    </div>
  );
} 