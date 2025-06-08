import { useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'

const navigationItems = [
  { label: 'Home', path: '/' },
  { label: 'Blog', path: '/blog' },
  { label: 'Spotlight', path: '/spotlight' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'Donate', path: '/donate' },
  { label: 'Dashboard', path: '/member-dashboard' },
  { label: 'Sign In', path: '/signin' },
]

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const location = useLocation()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        {navigationItems.map((item) => (
          <ListItem
            key={item.path}
            component={RouterLink}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            sx={{
              ...(location.pathname === item.path && {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
              }),
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 1 }}>
        <Toolbar>
          <Box component={RouterLink} to="/" sx={{ flexGrow: 0, mr: 2 }}>
            <img 
              src="/images/Ud_logo.png" 
              alt="UnderdogDevs" 
              style={{ height: 32, width: 'auto' }}
            />
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  color="inherit"
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                    },
                    ...(location.pathname === item.path && {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                    }),
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}