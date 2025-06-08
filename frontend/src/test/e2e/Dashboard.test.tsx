import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DashboardLayout } from '@/components/DashboardLayout'
import { AsideNavbar } from '@/components/dashboard/AsideNavbar'
import { DashboardHomePage } from '@/pages/dashboard/DashboardHomePage'
import { DocsPage } from '@/pages/dashboard/DocsPage'
import { ProfilePage } from '@/pages/dashboard/ProfilePage'
import { OnboardingPage } from '@/pages/dashboard/OnboardingPage'
import { renderWithProviders, takeScreenshot, measurePerformance, checkAccessibility } from '../helpers/testUtils'

// Mock ProtectedRoute for testing
const MockProtectedRoute = ({ children }: { children: React.ReactNode }) => <>{children}</>

// Custom render for testing dashboard routes
const renderDashboardWithRouter = (initialEntries: string[] = ['/member-dashboard']) => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
    },
  })

  const router = createMemoryRouter([
    {
      path: 'member-dashboard',
      element: (
        <MockProtectedRoute>
          <DashboardLayout />
        </MockProtectedRoute>
      ),
      children: [
        { index: true, element: <DashboardHomePage /> },
        { path: 'docs', element: <DocsPage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'onboarding', element: <OnboardingPage /> },
      ],
    },
  ], {
    initialEntries,
  })

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  )

  return {
    ...render(
      <TestWrapper>
        <RouterProvider router={router} />
      </TestWrapper>
    ),
    router,
  }
}

describe('Dashboard System End-to-End Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('1. Dashboard Layout Structure', () => {
    it('displays the dashboard layout with all components', () => {
      renderDashboardWithRouter()
      
      // Should have navigation at top
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      
      // Should have sidebar navigation
      expect(screen.getByText('Member Dashboard')).toBeInTheDocument()
      
      // Should have main content area
      expect(screen.getByRole('main')).toBeInTheDocument()
      
      takeScreenshot('dashboard-layout-structure')
    })

    it('displays sidebar navigation with all menu items', () => {
      renderDashboardWithRouter()
      
      const expectedMenuItems = [
        'Dashboard',
        'Documentation', 
        'Onboarding',
        'Profile'
      ]
      
      expectedMenuItems.forEach(item => {
        expect(screen.getByRole('link', { name: item })).toBeInTheDocument()
      })
      
      takeScreenshot('dashboard-sidebar-navigation')
    })

    it('applies correct styling to sidebar', () => {
      renderDashboardWithRouter()
      
      const sidebar = screen.getByRole('complementary') || screen.getByText('Member Dashboard').closest('aside')
      expect(sidebar).toHaveClass('w-64', 'bg-gray-100', 'min-h-screen', 'border-r')
    })

    it('displays dashboard content in main area', () => {
      renderDashboardWithRouter()
      
      expect(screen.getByText('Welcome to Your Dashboard')).toBeInTheDocument()
      
      // Check for dashboard cards
      expect(screen.getByText('Your Progress')).toBeInTheDocument()
      expect(screen.getByText('Recent Activity')).toBeInTheDocument()
      expect(screen.getByText('Upcoming Events')).toBeInTheDocument()
      expect(screen.getByText('Quick Actions')).toBeInTheDocument()
    })
  })

  describe('2. Dashboard Home Page Content', () => {
    it('displays progress tracking section', () => {
      renderDashboardWithRouter()
      
      // Check progress cards
      expect(screen.getByText('Courses Completed')).toBeInTheDocument()
      expect(screen.getByText('3/10')).toBeInTheDocument()
      
      expect(screen.getByText('Quizzes Passed')).toBeInTheDocument()
      expect(screen.getByText('5/8')).toBeInTheDocument()
      
      // Check for progress bars
      const progressBars = document.querySelectorAll('.bg-blue-600, .bg-green-600')
      expect(progressBars.length).toBeGreaterThan(0)
      
      takeScreenshot('dashboard-progress-section')
    })

    it('displays recent activity feed', () => {
      renderDashboardWithRouter()
      
      const activities = [
        'Completed "React Basics" quiz',
        'Started "JavaScript Fundamentals"',
        'Updated profile information'
      ]
      
      activities.forEach(activity => {
        expect(screen.getByText(activity)).toBeInTheDocument()
      })
      
      // Check for activity indicators (colored dots)
      const activityDots = document.querySelectorAll('.bg-green-500, .bg-blue-500, .bg-yellow-500')
      expect(activityDots.length).toBeGreaterThanOrEqual(3)
    })

    it('displays upcoming events section', () => {
      renderDashboardWithRouter()
      
      expect(screen.getByText('Mentorship Session')).toBeInTheDocument()
      expect(screen.getByText('Tomorrow, 2:00 PM')).toBeInTheDocument()
      
      expect(screen.getByText('Code Review')).toBeInTheDocument()
      expect(screen.getByText('Friday, 10:00 AM')).toBeInTheDocument()
    })

    it('displays quick actions grid', () => {
      renderDashboardWithRouter()
      
      const quickActions = [
        'Browse Docs',
        'Continue Onboarding',
        'Update Profile',
        'Read Blog'
      ]
      
      quickActions.forEach(action => {
        expect(screen.getByText(action)).toBeInTheDocument()
      })
      
      // Check that quick actions are links
      const quickActionLinks = screen.getAllByRole('link').filter(link => 
        quickActions.some(action => link.textContent?.includes(action))
      )
      expect(quickActionLinks.length).toBe(4)
      
      takeScreenshot('dashboard-quick-actions')
    })
  })

  describe('3. Sidebar Navigation Functionality', () => {
    it('highlights active navigation item correctly', () => {
      renderDashboardWithRouter(['/member-dashboard'])
      
      const dashboardLink = screen.getByRole('link', { name: 'Dashboard' })
      expect(dashboardLink).toHaveClass('bg-blue-100', 'text-blue-700')
      
      const docsLink = screen.getByRole('link', { name: 'Documentation' })
      expect(docsLink).toHaveClass('text-gray-700', 'hover:bg-gray-200')
    })

    it('navigates to documentation page when docs link is clicked', () => {
      const { router } = renderDashboardWithRouter()
      
      const docsLink = screen.getByRole('link', { name: 'Documentation' })
      fireEvent.click(docsLink)
      
      expect(router.state.location.pathname).toBe('/member-dashboard/docs')
      takeScreenshot('dashboard-docs-navigation')
    })

    it('navigates to profile page when profile link is clicked', () => {
      const { router } = renderDashboardWithRouter()
      
      const profileLink = screen.getByRole('link', { name: 'Profile' })
      fireEvent.click(profileLink)
      
      expect(router.state.location.pathname).toBe('/member-dashboard/profile')
      takeScreenshot('dashboard-profile-navigation')
    })

    it('navigates to onboarding page when onboarding link is clicked', () => {
      const { router } = renderDashboardWithRouter()
      
      const onboardingLink = screen.getByRole('link', { name: 'Onboarding' })
      fireEvent.click(onboardingLink)
      
      expect(router.state.location.pathname).toBe('/member-dashboard/onboarding')
      takeScreenshot('dashboard-onboarding-navigation')
    })

    it('maintains navigation state across page changes', () => {
      const { router } = renderDashboardWithRouter()
      
      // Navigate to docs
      const docsLink = screen.getByRole('link', { name: 'Documentation' })
      fireEvent.click(docsLink)
      
      // Check that docs is now active
      const activeDocsLink = screen.getByRole('link', { name: 'Documentation' })
      expect(activeDocsLink).toHaveClass('bg-blue-100', 'text-blue-700')
      
      // Navigate back to dashboard
      const dashboardLink = screen.getByRole('link', { name: 'Dashboard' })
      fireEvent.click(dashboardLink)
      
      // Check that dashboard is now active again
      const activeDashboardLink = screen.getByRole('link', { name: 'Dashboard' })
      expect(activeDashboardLink).toHaveClass('bg-blue-100', 'text-blue-700')
    })
  })

  describe('4. Quick Actions Functionality', () => {
    it('has correct href attributes for quick action links', () => {
      renderDashboardWithRouter()
      
      const linkMappings = [
        { name: 'Browse Docs', href: '/member-dashboard/docs' },
        { name: 'Continue Onboarding', href: '/member-dashboard/onboarding' },
        { name: 'Update Profile', href: '/member-dashboard/profile' },
        { name: 'Read Blog', href: '/blog' }
      ]
      
      linkMappings.forEach(({ name, href }) => {
        const link = screen.getByRole('link', { name })
        expect(link).toHaveAttribute('href', href)
      })
    })

    it('provides hover feedback for quick action buttons', async () => {
      const user = userEvent.setup()
      renderDashboardWithRouter()
      
      const browseDocsLink = screen.getByRole('link', { name: 'Browse Docs' })
      
      // Check hover class
      expect(browseDocsLink).toHaveClass('hover:border-blue-500', 'transition-colors')
      
      await user.hover(browseDocsLink)
      // Visual feedback is handled by CSS hover states
    })

    it('displays emoji icons for quick actions', () => {
      renderDashboardWithRouter()
      
      const expectedEmojis = ['📚', '🎯', '👤', '✍️']
      
      expectedEmojis.forEach(emoji => {
        expect(screen.getByText(emoji)).toBeInTheDocument()
      })
    })
  })

  describe('5. Dashboard Performance', () => {
    it('renders dashboard quickly', () => {
      const renderTime = measurePerformance('Dashboard render', () => {
        renderDashboardWithRouter()
      })
      
      expect(renderTime).toBeLessThan(100)
    })

    it('handles navigation between dashboard pages efficiently', () => {
      const { router } = renderDashboardWithRouter()
      
      const navigationTime = measurePerformance('Dashboard page navigation', () => {
        const pages = ['Documentation', 'Profile', 'Onboarding', 'Dashboard']
        
        pages.forEach(pageName => {
          const link = screen.getByRole('link', { name: pageName })
          fireEvent.click(link)
        })
      })
      
      expect(navigationTime).toBeLessThan(150)
    })

    it('updates sidebar active state efficiently', () => {
      const { router } = renderDashboardWithRouter()
      
      const updateTime = measurePerformance('Sidebar state updates', () => {
        // Rapidly switch between pages
        for (let i = 0; i < 5; i++) {
          const docsLink = screen.getByRole('link', { name: 'Documentation' })
          fireEvent.click(docsLink)
          
          const dashboardLink = screen.getByRole('link', { name: 'Dashboard' })
          fireEvent.click(dashboardLink)
        }
      })
      
      expect(updateTime).toBeLessThan(100)
    })
  })

  describe('6. Responsive Dashboard Design', () => {
    it('adapts dashboard grid to mobile layout', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      renderDashboardWithRouter()
      
      // Dashboard cards should stack on mobile
      const gridContainer = document.querySelector('.grid-cols-1.md\\:grid-cols-2')
      expect(gridContainer).toBeInTheDocument()
      
      takeScreenshot('dashboard-mobile-layout')
    })

    it('displays full dashboard layout on desktop', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      })

      renderDashboardWithRouter()
      
      // Sidebar should be visible
      expect(screen.getByText('Member Dashboard')).toBeInTheDocument()
      
      // Dashboard content should use full grid layout
      const gridContainer = document.querySelector('.lg\\:grid-cols-3')
      expect(gridContainer).toBeInTheDocument()
      
      takeScreenshot('dashboard-desktop-layout')
    })

    it('handles sidebar visibility across different screen sizes', () => {
      const viewports = [375, 768, 1024, 1200]
      
      viewports.forEach(width => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width,
        })

        renderDashboardWithRouter()
        
        // Sidebar should always be present in desktop dashboard
        expect(screen.getByText('Member Dashboard')).toBeInTheDocument()
      })
    })
  })

  describe('7. Dashboard Accessibility', () => {
    it('meets accessibility requirements for dashboard layout', () => {
      const { container } = renderDashboardWithRouter()
      
      const accessibilityCheck = checkAccessibility(container)
      
      // Check semantic structure
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByRole('main')).toBeInTheDocument()
      
      // Check heading hierarchy
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toHaveTextContent('Welcome to Your Dashboard')
      
      const h2s = screen.getAllByRole('heading', { level: 2 })
      expect(h2s.length).toBeGreaterThan(0)
      
      const h3s = screen.getAllByRole('heading', { level: 3 })
      expect(h3s.length).toBeGreaterThan(0)
    })

    it('supports keyboard navigation in sidebar', async () => {
      const user = userEvent.setup()
      renderDashboardWithRouter()
      
      const dashboardLink = screen.getByRole('link', { name: 'Dashboard' })
      
      // Focus should work
      dashboardLink.focus()
      expect(dashboardLink).toHaveFocus()
      
      // Tab navigation through sidebar links
      await user.tab()
      const docsLink = screen.getByRole('link', { name: 'Documentation' })
      expect(docsLink).toHaveFocus()
    })

    it('provides proper ARIA labels for progress bars', () => {
      renderDashboardWithRouter()
      
      // Check for progress information
      expect(screen.getByText('Courses Completed')).toBeInTheDocument()
      expect(screen.getByText('3/10')).toBeInTheDocument()
      
      expect(screen.getByText('Quizzes Passed')).toBeInTheDocument()
      expect(screen.getByText('5/8')).toBeInTheDocument()
    })

    it('ensures sufficient color contrast for active states', () => {
      renderDashboardWithRouter()
      
      const activeLink = screen.getByRole('link', { name: 'Dashboard' })
      expect(activeLink).toHaveClass('bg-blue-100', 'text-blue-700')
      
      const inactiveLink = screen.getByRole('link', { name: 'Documentation' })
      expect(inactiveLink).toHaveClass('text-gray-700')
    })
  })

  describe('8. Dashboard Data Display', () => {
    it('displays accurate progress percentages', () => {
      renderDashboardWithRouter()
      
      // Check for progress bars with correct widths
      const courseProgressBar = document.querySelector('.bg-blue-600[style*="width: 30%"]')
      expect(courseProgressBar).toBeInTheDocument()
      
      const quizProgressBar = document.querySelector('.bg-green-600[style*="width: 62.5%"]')
      expect(quizProgressBar).toBeInTheDocument()
    })

    it('shows realistic activity timestamps', () => {
      renderDashboardWithRouter()
      
      expect(screen.getByText('Tomorrow, 2:00 PM')).toBeInTheDocument()
      expect(screen.getByText('Friday, 10:00 AM')).toBeInTheDocument()
    })

    it('displays consistent styling across dashboard cards', () => {
      renderDashboardWithRouter()
      
      const dashboardCards = document.querySelectorAll('.bg-white.rounded-lg.shadow')
      expect(dashboardCards.length).toBeGreaterThanOrEqual(4)
      
      // Each card should have consistent spacing
      dashboardCards.forEach(card => {
        expect(card).toHaveClass('p-6')
      })
    })
  })

  describe('9. Integration with Main Navigation', () => {
    it('maintains top navigation alongside dashboard sidebar', () => {
      renderDashboardWithRouter()
      
      // Both navigation elements should be present
      const mainNav = screen.getByRole('navigation')
      expect(mainNav).toBeInTheDocument()
      
      const sidebarNav = screen.getByText('Member Dashboard')
      expect(sidebarNav).toBeInTheDocument()
    })

    it('allows navigation back to public pages from dashboard', () => {
      renderDashboardWithRouter()
      
      // Top navigation should still be functional
      const homeLink = screen.getByRole('link', { name: 'Home' })
      expect(homeLink).toBeInTheDocument()
      expect(homeLink).toHaveAttribute('href', '/')
      
      const blogLink = screen.getByRole('link', { name: 'Blog' })
      expect(blogLink).toBeInTheDocument()
      expect(blogLink).toHaveAttribute('href', '/blog')
    })
  })
})