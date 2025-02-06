'use client'
import { Login as LoginComponent } from '@/components/auth/Login'
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/components/theme';
import Box from '@mui/material/Box';

export default function Login() {
  return (
    <Box sx={{ position: 'relative', width: '100%', height: '80vh' }}>
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(/images/mentor1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.3,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }
      }} />
      <ThemeProvider theme={theme}>
        <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LoginComponent />
        </Box>
      </ThemeProvider>
    </Box>
  )
}
