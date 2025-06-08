import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
} from '@mui/material'

export function HomePage() {
  return (
    <Box sx={{ minHeight: '80vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #f05138 0%, #f6931d 100%)',
          color: 'white',
          py: 10,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h1" component="h1" gutterBottom>
              Welcome to UnderdogDevs
            </Typography>
            <Typography 
              variant="h5" 
              component="p" 
              sx={{ mb: 4, maxWidth: '800px', mx: 'auto', fontWeight: 300 }}
            >
              Helping formerly incarcerated and economically disadvantaged individuals 
              break into the tech industry through mentorship, education, and community support.
            </Typography>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              sx={{ justifyContent: 'center' }}
            >
              <Button
                component={RouterLink}
                to="/member-dashboard"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                }}
              >
                Join Our Community
              </Button>
              <Button
                component={RouterLink}
                to="/donate"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    backgroundColor: 'white',
                    color: 'primary.main',
                    borderColor: 'white',
                  },
                }}
              >
                Support Our Mission
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
              gap: 4, 
              textAlign: 'center' 
            }}
          >
            <Box>
              <Typography variant="h2" component="div" sx={{ color: 'primary.main', mb: 1 }}>
                500+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Members Supported
              </Typography>
            </Box>
            <Box>
              <Typography variant="h2" component="div" sx={{ color: 'primary.main', mb: 1 }}>
                200+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Job Placements
              </Typography>
            </Box>
            <Box>
              <Typography variant="h2" component="div" sx={{ color: 'primary.main', mb: 1 }}>
                85%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Success Rate
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Mission Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, 
              gap: 6, 
              alignItems: 'center' 
            }}
          >
            <Box>
              <Typography variant="h2" component="h2" gutterBottom>
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }} color="text.secondary">
                We believe that everyone deserves a second chance and the opportunity to build 
                a successful career in technology. Our community provides the mentorship, 
                resources, and support needed to overcome barriers and achieve success.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Through our programs, we help individuals develop technical skills, build 
                professional networks, and gain the confidence needed to thrive in the tech industry.
              </Typography>
            </Box>
            <Box>
              <Box
                component="img"
                src="/images/together.jpg"
                alt="Community members working together"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}