'use client'

import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Button, LinearProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/components/theme';
import styles from './dashboard.module.scss';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useRouter } from 'next/navigation';
import { progressService, ArticleWithProgress } from '@/lib/api/progress';


export default function MemberDashboard() {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const articlesWithProgress = await progressService.getAllArticlesWithProgress();
        setArticles(articlesWithProgress);
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, []);

  // Calculate progress
  const totalArticles = articles.length;
  const completedArticles = articles.filter(article => article.is_completed).length;
  const progressPercentage = totalArticles > 0 ? (completedArticles / totalArticles) * 100 : 0;
  const allCompleted = totalArticles > 0 && completedArticles === totalArticles;

  return (
    <ThemeProvider theme={theme}>
      <Box className={styles.dashboardContainer}>
        {/* Welcome section */}
        <Box className={styles.welcomeSection}>
          <Typography variant="h1" gutterBottom>
            Welcome to Underdog Devs!
          </Typography>
          <Typography variant="body1" gutterBottom>
            We're excited to have you in our developer community
          </Typography>
        </Box>

        {/* Main cards */}
        <Grid container spacing={4} className={styles.mainGrid}>
          {/* Onboarding card */}
          <Grid item xs={12} md={4}>
            <Paper className={styles.card} elevation={3}>
              <SchoolIcon className={styles.cardIcon} />
              <Typography variant="h6" gutterBottom>
                Onboarding
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Start by learning the essentials about our community
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => router.push('/member-dashboard/onboarding')}
                className={styles.cardButton}
              >
                {completedArticles === 0 ? 'Start Learning' : 'Continue Learning'}
              </Button>
            </Paper>
          </Grid>

          {/* Community card */}
          <Grid item xs={12} md={4}>
            <Paper className={styles.card} elevation={3}>
              <GroupIcon className={styles.cardIcon} />
              <Typography variant="h6" gutterBottom>
                Community
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Join our active Slack community
              </Typography>
              {allCompleted ? (
                <Button 
                  variant="contained" 
                  color="primary"
                  className={styles.cardButton}
                  onClick={() => router.push('/member-dashboard/onboarding')}
                >
                  Join Slack
                </Button>
              ) : (
                <Typography variant="caption" color="textSecondary" display="block">
                  * Available after completing onboarding
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Progress card */}
          <Grid item xs={12} md={4}>
            <Paper className={styles.card} elevation={3}>
              <CheckCircleIcon className={styles.cardIcon} />
              <Typography variant="h6" gutterBottom>
                Your Progress
              </Typography>
              <Box className={styles.progressSection}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Onboarding Progress
                </Typography>
                {isLoading ? (
                  <LinearProgress />
                ) : (
                  <>
                    <LinearProgress 
                      variant="determinate" 
                      value={progressPercentage} 
                      className={styles.progressBar}
                    />
                    <Typography variant="caption" color="textSecondary">
                      {completedArticles} of {totalArticles} materials completed
                    </Typography>
                  </>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
