import { Box, Typography, Card, CardContent, Avatar, TextField, Button, Stack } from '@mui/material'

export function ProfilePage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Profile
      </Typography>
      
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar 
                src="/images/fallback.png" 
                alt="Profile"
                sx={{ width: 80, height: 80 }}
              />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'semibold' }}>
                  John Doe
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Software Engineer
                </Typography>
              </Box>
            </Box>
            
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3 
              }}
            >
              <TextField
                fullWidth
                label="First Name"
                defaultValue="John"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Last Name"
                defaultValue="Doe"
                variant="outlined"
              />
              <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  defaultValue="john.doe@example.com"
                  variant="outlined"
                />
              </Box>
              <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                <TextField
                  fullWidth
                  label="Bio"
                  multiline
                  rows={4}
                  placeholder="Tell us about yourself..."
                  variant="outlined"
                />
              </Box>
            </Box>
            
            <Box>
              <Button 
                variant="contained" 
                size="large"
                sx={{ px: 3, py: 1.5, fontWeight: 'semibold' }}
              >
                Save Changes
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}