import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
} from '@mui/material'

export function DonatePage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Support Our Mission
        </Typography>
        
        <Typography 
          variant="h6" 
          align="center" 
          color="text.secondary" 
          sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}
        >
          Your donation helps us provide mentorship, education, and support to formerly 
          incarcerated and economically disadvantaged individuals entering the tech industry.
        </Typography>
      
        {/* Impact Stats */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
            gap: 3, 
            mb: 6 
          }}
        >
          <Card sx={{ textAlign: 'center', backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom>
                $50
              </Typography>
              <Typography variant="body2">
                Funds one mentorship session
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ textAlign: 'center', backgroundColor: 'success.light', color: 'success.contrastText' }}>
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom>
                $150
              </Typography>
              <Typography variant="body2">
                Provides one month of career support
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ textAlign: 'center', backgroundColor: 'secondary.light', color: 'secondary.contrastText' }}>
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom>
                $500
              </Typography>
              <Typography variant="body2">
                Sponsors a full training program
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Make a Donation
            </Typography>
            <Typography variant="body1">
              Donation form will be implemented in Phase 5 with full payment integration.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}