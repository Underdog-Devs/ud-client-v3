'use client'

import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, LinearProgress, Alert, Snackbar } from '@mui/material';
import { DocCard } from './DocCard';
import { strapiService, DocCard as DocCardType } from '@/lib/api/strapi';

export function DocsList() {
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState<DocCardType[]>([]);
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
    const fetchDocs = async () => {
      try {
        const docsData = await strapiService.getAllDocs();
        setDocs(docsData);
      } catch (error) {
        console.error('Error fetching docs:', error);
        setNotification({
          open: true,
          message: 'Failed to load documentation. Please refresh the page.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
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
        {docs.map((doc) => (
          <Grid item xs={12} md={6} lg={4} key={doc.id}>
            <DocCard 
              slug={doc.slug}
              title={doc.title}
              description={doc.description}
              visibility={doc.visibility}
            />
          </Grid>
        ))}
      </Grid>

      {docs.length === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          border: 1,
          borderColor: 'divider'
        }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No documentation available
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