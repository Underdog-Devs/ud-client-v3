import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { SchoolRounded as SchoolIcon } from '@mui/icons-material';
import { ArticleList } from '@/components/dashboard/ArticleList';

export default function OnboardingPage() {
  return (
    <Container maxWidth="lg">
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 4,
          mt: 4 
        }}
      >
        <SchoolIcon 
          sx={{ 
            fontSize: 40,
            color: 'primary.main'
          }} 
        />
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Onboarding
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Start your journey by reading through these essential articles. Each article will help you understand our community better and get you ready to contribute.
          </Typography>
        </Box>
      </Box>

      <ArticleList />
    </Container>
  );
}
