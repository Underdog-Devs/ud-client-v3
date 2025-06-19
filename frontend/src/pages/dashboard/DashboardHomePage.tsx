import { Box, Typography, Card, CardContent, LinearProgress, Stack } from '@mui/material'

export function DashboardHomePage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Welcome to Your Dashboard
      </Typography>
      
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 4 
        }}
      >
        {/* Progress Card */}
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
        
        {/* Recent Activity */}
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
        
        {/* Upcoming Events */}
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
      </Box>
      
      {/* Quick Actions */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'semibold' }}>Quick Actions</Typography>
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2 
            }}
          >
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
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}