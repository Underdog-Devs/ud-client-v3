import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { Navigation } from './Navigation'
import { AsideNavbar } from './dashboard/AsideNavbar'

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Navigation />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <AsideNavbar 
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          onMobileToggle={handleDrawerToggle}
        />
        <Box
          component="main"
          sx={{
            flex: 1,
            backgroundColor: 'background.default',
            p: 3,
            ...(isMobile && {
              width: `calc(100% - 240px)`,
            }),
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}