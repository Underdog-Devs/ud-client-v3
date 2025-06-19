import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material'
import { authService } from '@/services/auth'

export function RequestPasswordResetPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)

    try {
      const response = await authService.requestPasswordReset(email)
      setMessage(response.message)
      setIsSubmitted(true)
    } catch (err: unknown) {
      setError((err as { response?: { data?: { detail?: string } } }).response?.data?.detail || 'Failed to send reset email. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
          }}
        >
          <Card sx={{ width: '100%', maxWidth: 400 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <img
                  src="/images/Ud_logo.png"
                  alt="UnderdogDevs"
                  style={{ height: 48, width: 'auto', marginBottom: 24 }}
                />
                <Typography variant="h4" component="h1" gutterBottom>
                  Check your email
                </Typography>
              </Box>

              <Alert severity="success" sx={{ mb: 3 }}>
                {message}
              </Alert>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                If you don't see the email in your inbox, check your spam folder.
              </Typography>

              <Button
                component={RouterLink}
                to="/signin"
                fullWidth
                variant="outlined"
                size="large"
              >
                Back to Sign In
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <img
                src="/images/Ud_logo.png"
                alt="UnderdogDevs"
                style={{ height: 48, width: 'auto', marginBottom: 24 }}
              />
              <Typography variant="h4" component="h1" gutterBottom>
                Reset your password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your email address and we'll send you a link to reset your password.
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email address"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                variant="outlined"
                disabled={isSubmitting}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : undefined}
              >
                {isSubmitting ? 'Sending...' : 'Send reset link'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Link 
                  component={RouterLink} 
                  to="/signin" 
                  variant="body2" 
                  color="primary"
                >
                  Back to Sign In
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}