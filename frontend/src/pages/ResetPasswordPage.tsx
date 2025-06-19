import { useState, useEffect } from 'react'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
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

export function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.')
    }
  }, [token])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      await authService.confirmPasswordReset(token, formData.password)
      setIsSuccess(true)
      setTimeout(() => {
        navigate('/signin')
      }, 3000)
    } catch (err: unknown) {
      setError((err as { response?: { data?: { detail?: string } } }).response?.data?.detail || 'Failed to reset password. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
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
                  Password reset successful
                </Typography>
              </Box>

              <Alert severity="success" sx={{ mb: 3 }}>
                Your password has been reset successfully. You will be redirected to the sign in page shortly.
              </Alert>

              <Button
                component={RouterLink}
                to="/signin"
                fullWidth
                variant="contained"
                size="large"
              >
                Sign In Now
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
                Set new password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your new password below.
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
                id="password"
                name="password"
                label="New Password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={isSubmitting}
                helperText="Password must be at least 8 characters with uppercase, lowercase, and number"
              />

              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
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
                disabled={isSubmitting || !token}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : undefined}
              >
                {isSubmitting ? 'Resetting...' : 'Reset password'}
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