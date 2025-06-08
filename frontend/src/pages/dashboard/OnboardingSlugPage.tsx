import { useParams } from 'react-router-dom'
import { Box, Typography, Card, CardContent } from '@mui/material'

export function OnboardingSlugPage() {
  const { slug } = useParams<{ slug: string }>()
  
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Onboarding: {slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Typography>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="body1">
            Onboarding content for slug: {slug} will be migrated from Next.js in Phase 4.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}