'use client'

import { Box, Typography } from '@mui/material';
import theme from '@/components/theme';
import { ThemeProvider } from '@mui/material/styles';

export default function MemberDashboard() {
  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Typography variant="h2" align="center">Welcome to the member dashboard</Typography>
      </Box>
    </ThemeProvider>
  );
}
