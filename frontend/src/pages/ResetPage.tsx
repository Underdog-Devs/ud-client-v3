import { Container, Box, Typography, Card, CardContent } from '@mui/material'

export function ResetPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          Reset Password
        </Typography>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="body1">
              Password reset page content will be migrated from Next.js in Phase 4.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}