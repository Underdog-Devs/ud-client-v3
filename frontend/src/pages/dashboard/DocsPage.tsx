import { Box, Typography, Card, CardContent, Stack, Link, List, ListItem, ListItemText } from '@mui/material'

export function DocsPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Documentation
      </Typography>
      
      <Stack spacing={4}>
        {/* Getting Started */}
        <Box component="section">
          <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 'semibold' }}>
            Getting Started
          </Typography>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Welcome to the UnderdogDevs documentation. Here you'll find everything you need 
                to know about our programs, resources, and how to make the most of your journey.
              </Typography>
              <List sx={{ pl: 2 }}>
                <ListItem disablePadding>
                  <ListItemText primary="• Complete your profile setup" sx={{ color: 'text.secondary' }} />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText primary="• Take the initial assessment" sx={{ color: 'text.secondary' }} />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText primary="• Schedule your first mentorship session" sx={{ color: 'text.secondary' }} />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText primary="• Join community discussions" sx={{ color: 'text.secondary' }} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>
        
        {/* Learning Resources */}
        <Box component="section">
          <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 'semibold' }}>
            Learning Resources
          </Typography>
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3 
            }}
          >
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'semibold' }}>
                  Programming Fundamentals
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Learn the basics of programming, data structures, and algorithms.
                </Typography>
                <Link href="#" sx={{ fontWeight: 'medium', textDecoration: 'none' }}>
                  View Resources →
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'semibold' }}>
                  Web Development
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Master HTML, CSS, JavaScript, and modern frameworks.
                </Typography>
                <Link href="#" sx={{ fontWeight: 'medium', textDecoration: 'none' }}>
                  View Resources →
                </Link>
              </CardContent>
            </Card>
          </Box>
        </Box>
        
        {/* Community Guidelines */}
        <Box component="section">
          <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 'semibold' }}>
            Community Guidelines
          </Typography>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'semibold' }}>
                    Respect and Inclusion
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    We maintain a welcoming environment for all community members.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'semibold' }}>
                    Active Participation
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Engage constructively in discussions and support fellow members.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'semibold' }}>
                    Continuous Learning
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Embrace the learning process and share your knowledge with others.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  )
}