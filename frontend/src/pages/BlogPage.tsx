import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material'

export function BlogPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Blog
        </Typography>
      
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
            gap: 3 
          }}
        >
          {/* Placeholder blog posts */}
          {[1, 2, 3, 4, 5, 6].map((post) => (
            <Card key={post}>
              <CardMedia
                component="img"
                height="200"
                image="/images/fallback.png"
                alt="Blog post"
              />
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Blog Post Title {post}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  This is a preview of the blog post content. It gives readers 
                  an idea of what the full article contains.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    January {post}, 2025
                  </Typography>
                  <Typography 
                    component="a" 
                    href={`/blog/sample-post-${post}/post-${post}`}
                    variant="body2"
                    sx={{ 
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Read More →
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  )
}