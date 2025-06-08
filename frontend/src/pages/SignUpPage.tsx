import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
} from '@mui/material'

export function SignUpPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Create Account
        </Typography>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="body1">
              Sign up page content will be migrated from Next.js in Phase 5.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}