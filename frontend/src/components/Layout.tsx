import { Outlet } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import { Navigation } from './Navigation'
import { Footer } from './Footer'

export function Layout() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Navigation />
      <Box
        component="main"
        sx={{
          flex: 1,
          backgroundColor: 'background.default',
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Box>
  )
}