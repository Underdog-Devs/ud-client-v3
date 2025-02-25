'use client'

import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { MenuBook as MenuBookIcon } from '@mui/icons-material';
import theme from '@/components/theme';
import { DocsList } from '@/components/docs/DocsList';

export default function DocsPage() {
  return (
    <Container maxWidth="lg">
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 4,
          mt: 4 
        }}>
        <MenuBookIcon 
          sx={{ 
            fontSize: 40,
            color: theme.palette.primary.main
          }} 
        />
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Documentation
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore our collection of articles and guides about programming, learning resources, and best practices for becoming a developer.
          </Typography>
        </Box>
      </Box>

      <DocsList />
    </Container>
  );
}
