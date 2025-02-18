'use client'

import { Box, Typography, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/components/theme';
import Link from 'next/link';

export default function Profile() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        display: 'flex',
        minHeight: '60vh',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 2
      }}>
            <Typography variant="h1">
                Coming Soon
            </Typography>
            <Button variant="contained" color="primary">
          <Link href="/member-dashboard" style={{ textDecoration: 'none', color: 'white' }}>
            Back to Dashboard
          </Link>
        </Button>
      </Box>
    </ThemeProvider>
  );
}
