import { Container, Box, Typography, Card, CardContent, CardMedia, Grid, Link } from '@mui/material'

export function SpotlightPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          Member Spotlight
        </Typography>
        
        <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: '750px' }}>
          Meet some of our amazing community members who have successfully transitioned 
          into tech careers and are making a difference in their lives and communities.
        </Typography>
        
        <Grid container spacing={4}>
          {/* Spotlight profiles */}
          {[1, 2, 3, 4, 5, 6].map((member) => (
            <Grid item xs={12} md={6} lg={4} key={member}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="256"
                  image="/images/fallback.png"
                  alt={`Member ${member}`}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h5" component="h3" sx={{ mb: 1, fontWeight: 'semibold' }}>
                    Member {member}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ mb: 2, fontWeight: 'medium' }}>
                    Software Engineer
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    "UnderdogDevs provided me with the mentorship and community support 
                    I needed to successfully transition into a tech career."
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Joined: 2024
                    </Typography>
                    <Link 
                      href={`/spotlight/member-${member}`}
                      sx={{ fontWeight: 'medium', textDecoration: 'none' }}
                    >
                      Read Story →
                    </Link>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  )
}