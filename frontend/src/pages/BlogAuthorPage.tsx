import { useParams } from 'react-router-dom'
import { Container, Box, Typography, Card, CardContent } from '@mui/material'

export function BlogAuthorPage() {
  const { author, id } = useParams<{ author: string; id: string }>()
  
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          Posts by {author?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Showing post ID: {id} by author: {author}
        </Typography>
        
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="body1">
              This page will display posts filtered by author. Implementation coming in Phase 4B.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}