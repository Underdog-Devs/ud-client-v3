import { Box, Typography, Card, CardContent, Grid, Stack, Chip, Link } from '@mui/material'

export function OnboardingPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Onboarding
      </Typography>
      
      <Stack spacing={3}>
        {/* Progress indicator */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'semibold' }}>
              Your Progress
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">Complete Profile</Typography>
                <Chip 
                  label="✓ Completed" 
                  color="success" 
                  size="small" 
                  sx={{ fontWeight: 'semibold' }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">Initial Assessment</Typography>
                <Chip 
                  label="In Progress" 
                  color="primary" 
                  size="small" 
                  sx={{ fontWeight: 'semibold' }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">First Mentorship Session</Typography>
                <Chip 
                  label="Pending" 
                  color="default" 
                  size="small" 
                  sx={{ fontWeight: 'semibold', color: 'text.disabled' }}
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>
        
        {/* Onboarding modules */}
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((module) => (
            <Grid item xs={12} md={6} key={module}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'semibold' }}>
                    Module {module}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Description of onboarding module {module} content and objectives.
                  </Typography>
                  <Link 
                    href={`/member-dashboard/onboarding/module-${module}`}
                    sx={{ fontWeight: 'medium', textDecoration: 'none' }}
                  >
                    Start Module →
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  )
}