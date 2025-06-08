import { useParams } from 'react-router-dom'
import { Container, Box, Typography, Avatar, Divider, Stack } from '@mui/material'

export function BlogPostPage() {
  const { title, id } = useParams<{ title: string; id: string }>()
  
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        <Box component="article">
          <Box component="header" sx={{ mb: 4 }}>
            <Typography variant="h2" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
              {title?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Blog Post'}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" color="text.secondary">
              <Typography variant="body2">By John Doe</Typography>
              <Typography variant="body2">•</Typography>
              <Typography variant="body2">January 15, 2025</Typography>
              <Typography variant="body2">•</Typography>
              <Typography variant="body2">5 min read</Typography>
            </Stack>
          </Box>
          
          <Box
            component="img"
            src="/images/fallback.png"
            alt="Blog post featured image"
            sx={{
              width: '100%',
              height: 256,
              objectFit: 'cover',
              borderRadius: 2,
              mb: 4
            }}
          />
          
          <Stack spacing={3}>
            <Typography variant="body1">
              This is a sample blog post content for post ID: {id}. In a real application, 
              this content would be fetched from the FastAPI backend based on the route parameters.
            </Typography>
            
            <Typography variant="body1">
              The blog post page demonstrates how React Router v6 handles dynamic routing 
              with parameters. The title and ID from the URL are available via the useParams hook.
            </Typography>
            
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'semibold' }}>
              Section Heading
            </Typography>
            
            <Typography variant="body1">
              More content would go here, including rich text formatting, images, 
              code blocks, and other elements that make up a complete blog post.
            </Typography>
            
            <Box
              component="blockquote"
              sx={{
                borderLeft: 4,
                borderColor: 'primary.main',
                pl: 3,
                fontStyle: 'italic',
                color: 'text.secondary'
              }}
            >
              <Typography variant="body1">
                "This is an example quote that might appear in a blog post to highlight 
                important information or insights."
              </Typography>
            </Box>
            
            <Typography variant="body1">
              The concluding paragraph would wrap up the blog post content and 
              potentially include a call-to-action for readers.
            </Typography>
          </Stack>
          
          <Box component="footer" sx={{ mt: 6, pt: 4 }}>
            <Divider sx={{ mb: 4 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar 
                  src="/images/fallback.png" 
                  alt="Author avatar"
                  sx={{ width: 48, height: 48 }}
                />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'semibold' }}>
                    John Doe
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Software Engineer & Mentor
                  </Typography>
                </Box>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Published on January 15, 2025
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}