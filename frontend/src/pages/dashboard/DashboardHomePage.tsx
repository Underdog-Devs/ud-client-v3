import { Box, Typography, Card, CardContent, Grid, LinearProgress, Stack } from '@mui/material'

export function DashboardHomePage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Welcome to Your Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Progress Card */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'semibold' }}>Your Progress</Typography>
              <Stack spacing={2}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Courses Completed</Typography>
                    <Typography variant="body2">3/10</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={30} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Quizzes Passed</Typography>
                    <Typography variant="body2">5/8</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={62.5} 
                    sx={{ height: 8, borderRadius: 4 }} 
                    color="success"
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Activity */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'semibold' }}>Recent Activity</Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, bgcolor: 'success.main', borderRadius: '50%' }} />
                  <Typography variant="body2">Completed "React Basics" quiz</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} />
                  <Typography variant="body2">Started "JavaScript Fundamentals"</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, bgcolor: 'warning.main', borderRadius: '50%' }} />
                  <Typography variant="body2">Updated profile information</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Upcoming Events */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'semibold' }}>Upcoming Events</Typography>
              <Stack spacing={2}>
                <Box sx={{ borderLeft: 4, borderColor: 'primary.main', pl: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Mentorship Session</Typography>
                  <Typography variant="caption" color="text.secondary">Tomorrow, 2:00 PM</Typography>
                </Box>
                <Box sx={{ borderLeft: 4, borderColor: 'success.main', pl: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Code Review</Typography>
                  <Typography variant="caption" color="text.secondary">Friday, 10:00 AM</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Quick Actions */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'semibold' }}>Quick Actions</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                component="a" 
                href="/member-dashboard/docs"
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  textDecoration: 'none',
                  border: 1,
                  borderColor: 'divider',
                  '&:hover': { borderColor: 'primary.main' },
                  transition: 'border-color 0.2s'
                }}
              >
                <Typography variant="h4" sx={{ mb: 1 }}>📚</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Browse Docs</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                component="a" 
                href="/member-dashboard/onboarding"
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  textDecoration: 'none',
                  border: 1,
                  borderColor: 'divider',
                  '&:hover': { borderColor: 'primary.main' },
                  transition: 'border-color 0.2s'
                }}
              >
                <Typography variant="h4" sx={{ mb: 1 }}>🎯</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Continue Onboarding</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                component="a" 
                href="/member-dashboard/profile"
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  textDecoration: 'none',
                  border: 1,
                  borderColor: 'divider',
                  '&:hover': { borderColor: 'primary.main' },
                  transition: 'border-color 0.2s'
                }}
              >
                <Typography variant="h4" sx={{ mb: 1 }}>👤</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Update Profile</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                component="a" 
                href="/blog"
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  textDecoration: 'none',
                  border: 1,
                  borderColor: 'divider',
                  '&:hover': { borderColor: 'primary.main' },
                  transition: 'border-color 0.2s'
                }}
              >
                <Typography variant="h4" sx={{ mb: 1 }}>✍️</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Read Blog</Typography>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}