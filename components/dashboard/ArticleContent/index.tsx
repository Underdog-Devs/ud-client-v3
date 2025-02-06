'use client'

import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Breadcrumbs, Link as MuiLink, Snackbar, Alert, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { Home as HomeIcon, ChevronRight as ChevronRightIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import styles from './styles.module.scss';
import ReactMarkdown from 'react-markdown';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface ArticleContentProps {
  title: string;
  content: string;
  slug: string;
}

export function ArticleContent({ title, content, slug }: ArticleContentProps) {
  const router = useRouter();
  const theme = useTheme();
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [articleId, setArticleId] = useState<string | null>(null);
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

  // Загружаем id статьи и прогресс при монтировании
  useEffect(() => {
    const loadArticleData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Получаем id статьи из таблицы articles
        const { data: articleData, error: articleError } = await supabase
          .from('articles')
          .select('id')
          .eq('slug', slug)
          .single();

        if (articleError) throw articleError;
        if (!articleData) {
          console.error('Article not found in Supabase');
          return;
        }

        setArticleId(articleData.id);

        // Проверяем прогресс
        const { data: progressData, error: progressError } = await supabase
          .from('user_article_progress')
          .select('completed')
          .eq('user_id', user.id)
          .eq('article_id', articleData.id)
          .single();

        if (progressError && progressError.code !== 'PGRST116') throw progressError;
        if (progressData) {
          setIsCompleted(progressData.completed);
        }
      } catch (error) {
        console.error('Error loading article data:', error);
        setNotification({
          open: true,
          message: 'Failed to load article data',
          severity: 'error'
        });
      }
    };

    loadArticleData();
  }, [slug]);

  const markAsCompleted = async () => {
    if (!articleId) {
      setNotification({
        open: true,
        message: 'Article ID not found',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setNotification({
          open: true,
          message: 'Please sign in to track your progress',
          severity: 'error'
        });
        return;
      }

      const { error } = await supabase
        .from('user_article_progress')
        .upsert({
          user_id: user.id,
          article_id: articleId,
          completed: true
        }, {
          onConflict: 'user_id,article_id'
        });

      if (error) throw error;

      setIsCompleted(true);
      setNotification({
        open: true,
        message: 'Article marked as completed!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      setNotification({
        open: true,
        message: 'Failed to update progress',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      router.push('/member-dashboard/onboarding');
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <div className={styles.container}>
      <Breadcrumbs 
        separator={<ChevronRightIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ 
          mb: { xs: 2, sm: 3 },
          '.MuiBreadcrumbs-ol': {
            flexWrap: 'wrap',
          },
          '.MuiBreadcrumbs-li': {
            display: 'flex',
            alignItems: 'center',
          }
        }}
      >
        <Link href="/member-dashboard" passHref legacyBehavior>
          <MuiLink
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'text.primary',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
            Dashboard
          </MuiLink>
        </Link>
        <Link href="/member-dashboard/onboarding" passHref legacyBehavior>
          <MuiLink
            sx={{
              color: 'text.primary',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Onboarding
          </MuiLink>
        </Link>
        <Typography 
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: { xs: 'normal', sm: 'nowrap' },
            maxWidth: { xs: '100%', sm: '200px' }
          }}
        >
          {title}
        </Typography>
      </Breadcrumbs>

      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 },
          backgroundColor: 'background.paper',
          borderRadius: { xs: 1, sm: 2 },
          border: 1,
          borderColor: 'divider',
          overflow: 'hidden'
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            textAlign: 'center', 
            color: theme.palette.text.primary, 
            fontWeight: 'bold',
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
            wordBreak: 'break-word'
          }}
        >
          {title}
        </Typography>
        
        <Box className={styles.markdown}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={isCompleted || loading || !articleId}
            onClick={markAsCompleted}
            startIcon={isCompleted ? <CheckCircleIcon /> : null}
            sx={{
              minWidth: 200,
              py: 1.5
            }}
          >
            {isCompleted ? 'Completed' : 'Mark as Completed'}
          </Button>
        </Box>
      </Paper>

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