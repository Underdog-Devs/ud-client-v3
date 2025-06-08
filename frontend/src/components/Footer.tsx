import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
} from '@mui/material'

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'secondary.dark',
        color: 'white',
        py: 6,
      }}
    >
      <Container maxWidth="xl">
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, 
            gap: 4 
          }}
        >
          {/* Logo and Description */}
          <Box>
            <Box sx={{ mb: 2 }}>
              <img 
                src="/images/Ud_logo.png" 
                alt="UnderdogDevs" 
                style={{ 
                  height: 32, 
                  width: 'auto',
                  filter: 'brightness(0) invert(1)'
                }}
              />
            </Box>
            <Typography variant="body1" sx={{ color: 'grey.300', mb: 2 }}>
              Helping formerly incarcerated and economically disadvantaged individuals 
              break into the tech industry through mentorship and community support.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="#" sx={{ color: 'grey.300', '&:hover': { color: 'white' } }}>
                Twitter
              </Link>
              <Link href="#" sx={{ color: 'grey.300', '&:hover': { color: 'white' } }}>
                LinkedIn
              </Link>
              <Link href="#" sx={{ color: 'grey.300', '&:hover': { color: 'white' } }}>
                GitHub
              </Link>
            </Box>
          </Box>
          
          {/* Quick Links */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link 
                component={RouterLink} 
                to="/" 
                sx={{ color: 'grey.300', '&:hover': { color: 'white' }, textDecoration: 'none' }}
              >
                Home
              </Link>
              <Link 
                component={RouterLink} 
                to="/blog" 
                sx={{ color: 'grey.300', '&:hover': { color: 'white' }, textDecoration: 'none' }}
              >
                Blog
              </Link>
              <Link 
                component={RouterLink} 
                to="/spotlight" 
                sx={{ color: 'grey.300', '&:hover': { color: 'white' }, textDecoration: 'none' }}
              >
                Spotlight
              </Link>
              <Link 
                component={RouterLink} 
                to="/testimonials" 
                sx={{ color: 'grey.300', '&:hover': { color: 'white' }, textDecoration: 'none' }}
              >
                Testimonials
              </Link>
            </Box>
          </Box>
          
          {/* Get Involved */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Get Involved
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link 
                component={RouterLink} 
                to="/member-dashboard" 
                sx={{ color: 'grey.300', '&:hover': { color: 'white' }, textDecoration: 'none' }}
              >
                Join Community
              </Link>
              <Link 
                component={RouterLink} 
                to="/donate" 
                sx={{ color: 'grey.300', '&:hover': { color: 'white' }, textDecoration: 'none' }}
              >
                Donate
              </Link>
              <Link 
                component={RouterLink} 
                to="/signin" 
                sx={{ color: 'grey.300', '&:hover': { color: 'white' }, textDecoration: 'none' }}
              >
                Sign In
              </Link>
              <Link 
                component={RouterLink} 
                to="/signup" 
                sx={{ color: 'grey.300', '&:hover': { color: 'white' }, textDecoration: 'none' }}
              >
                Sign Up
              </Link>
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 4, borderColor: 'grey.700' }} />
        
        <Typography variant="body2" align="center" sx={{ color: 'grey.300' }}>
          &copy; 2025 UnderdogDevs. All rights reserved.
        </Typography>
      </Container>
    </Box>
  )
}