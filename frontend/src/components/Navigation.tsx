import { useState } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
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
  Menu,
  MenuItem,
  Avatar,
  Typography,
} from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'

const publicNavigationItems = [
  { label: 'Home', path: '/' },
  { label: 'Blog', path: '/blog' },
  { label: 'Spotlight', path: '/spotlight' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'Donate', path: '/donate' },
]

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await logout()
    handleProfileMenuClose()
    navigate('/')
  }

  const navigationItems = isAuthenticated 
    ? publicNavigationItems 
    : [...publicNavigationItems, { label: 'Sign In', path: '/signin' }]

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
        {isAuthenticated && (
          <>
            <ListItem
              component={RouterLink}
              to="/member-dashboard"
              onClick={() => setMobileOpen(false)}
              sx={{
                ...(location.pathname.startsWith('/member-dashboard') && {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                }),
              }}
            >
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem
              onClick={() => {
                setMobileOpen(false)
                handleLogout()
              }}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemText primary="Sign Out" />
            </ListItem>
          </>
        )}
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
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
              
              {isAuthenticated && (
                <>
                  <Button
                    component={RouterLink}
                    to="/member-dashboard"
                    color="inherit"
                    sx={{
                      color: 'text.primary',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                      },
                      ...(location.pathname.startsWith('/member-dashboard') && {
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                      }),
                    }}
                  >
                    Dashboard
                  </Button>
                  
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                    sx={{ color: 'text.primary' }}
                  >
                    {user?.avatar_url ? (
                      <Avatar
                        src={user.avatar_url}
                        alt={user.first_name || user.email}
                        sx={{ width: 32, height: 32 }}
                      />
                    ) : (
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {(user?.first_name || user?.email || 'U')[0].toUpperCase()}
                      </Avatar>
                    )}
                  </IconButton>
                </>
              )}
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
      
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={() => { navigate('/member-dashboard/profile'); handleProfileMenuClose(); }}>
          <Typography>Profile</Typography>
        </MenuItem>
        <MenuItem onClick={() => { navigate('/change-password'); handleProfileMenuClose(); }}>
          <Typography>Change Password</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography>Sign Out</Typography>
        </MenuItem>
      </Menu>
    </>
  )
}