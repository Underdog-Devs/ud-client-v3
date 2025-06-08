import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Link,
  Container,
} from '@mui/material'

export function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // TODO: Implement sign in logic
    console.log('Sign in data:', formData)
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
                Sign in to your account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Or{' '}
                <Link component={RouterLink} to="/signup" color="primary">
                  create a new account
                </Link>
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                id="email-address"
                name="email"
                label="Email address"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
              
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Remember me"
                />
                <Link 
                  component={RouterLink} 
                  to="/auth/request-password-rest" 
                  variant="body2" 
                  color="primary"
                >
                  Forgot your password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 2 }}
              >
                Sign in
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}