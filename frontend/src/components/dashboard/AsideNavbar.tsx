import { Link as RouterLink, useLocation } from 'react-router-dom'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  MenuBook as DocsIcon,
  School as OnboardingIcon,
  Person as ProfileIcon,
} from '@mui/icons-material'

interface AsideNavbarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
  onMobileToggle?: () => void
}

const navItems = [
  { path: '/member-dashboard', label: 'Dashboard', icon: DashboardIcon, exact: true },
  { path: '/member-dashboard/docs', label: 'Documentation', icon: DocsIcon },
  { path: '/member-dashboard/onboarding', label: 'Onboarding', icon: OnboardingIcon },
  { path: '/member-dashboard/profile', label: 'Profile', icon: ProfileIcon },
]

const drawerWidth = 240

export function AsideNavbar({ mobileOpen, onMobileClose }: AsideNavbarProps) {
  const location = useLocation()

  const drawer = (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
        Member Dashboard
      </Typography>
      
      <List>
        {navItems.map((item) => {
          const isActive = item.exact 
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path)
          
          const Icon = item.icon
          
          return (
            <ListItem
              key={item.path}
              component={RouterLink}
              to={item.path}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                ...(isActive && {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }),
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Icon sx={{ fontSize: 20 }} />
                <ListItemText primary={item.label} />
              </Box>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            backgroundColor: 'background.paper',
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  )
}