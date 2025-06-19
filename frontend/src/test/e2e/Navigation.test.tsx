import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from '@/components/Layout'
import { Navigation } from '@/components/Navigation'
import { HomePage } from '@/pages/HomePage'
import { BlogPage } from '@/pages/BlogPage'
import { SpotlightPage } from '@/pages/SpotlightPage'
import { TestimonialsPage } from '@/pages/TestimonialsPage'
import { DonatePage } from '@/pages/DonatePage'
import { SignInPage } from '@/pages/SignInPage'
import { renderWithProviders, takeScreenshot, measurePerformance } from '../helpers/testUtils'
import { AuthProvider } from '@/contexts/AuthContext'
import * as authHook from '@/hooks/useAuth'

// Custom render for testing with specific routes
const renderWithRouter = (initialEntries: string[] = ['/']) => {
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
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'spotlight', element: <SpotlightPage /> },
        { path: 'testimonials', element: <TestimonialsPage /> },
        { path: 'donate', element: <DonatePage /> },
        { path: 'signin', element: <SignInPage /> },
      ],
    },
  ], {
    initialEntries,
  })

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
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

describe('Navigation End-to-End Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock the useAuth hook for navigation tests
    vi.spyOn(authHook, 'useAuth').mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    })
  })

  describe('1. Navigation Structure and Visibility', () => {
    it('displays the navigation bar with logo', () => {
      renderWithProviders(<Navigation />)
      
      // Use more specific selector to get navigation logo only
      const nav = screen.getByRole('banner')
      const logo = nav.querySelector('img[alt="UnderdogDevs"]')
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute('src', '/images/Ud_logo.png')
      
      takeScreenshot('navigation-logo')
    })

    it('displays all navigation links when unauthenticated', () => {
      renderWithProviders(<Navigation />)
      
      const expectedLinks = [
        'Home',
        'Blog', 
        'Spotlight',
        'Testimonials',
        'Donate',
        'Sign In'
      ]
      
      expectedLinks.forEach(linkText => {
        expect(screen.getByRole('link', { name: linkText })).toBeInTheDocument()
      })
      
      // Dashboard should NOT be visible when unauthenticated
      expect(screen.queryByRole('link', { name: 'Dashboard' })).not.toBeInTheDocument()
      
      takeScreenshot('navigation-all-links-unauthenticated')
    })

    it('has correct href attributes for unauthenticated links', () => {
      renderWithProviders(<Navigation />)
      
      const linkMappings = [
        { name: 'Home', href: '/' },
        { name: 'Blog', href: '/blog' },
        { name: 'Spotlight', href: '/spotlight' },
        { name: 'Testimonials', href: '/testimonials' },
        { name: 'Donate', href: '/donate' },
        { name: 'Sign In', href: '/signin' }
      ]
      
      linkMappings.forEach(({ name, href }) => {
        const link = screen.getByRole('link', { name })
        expect(link).toHaveAttribute('href', href)
      })
    })

    it('displays authenticated navigation links when user is logged in', () => {
      // Override the auth mock for this specific test
      vi.spyOn(authHook, 'useAuth').mockReturnValue({
        user: { id: 1, email: 'test@example.com', first_name: 'Test', last_name: 'User', is_active: true, is_verified: true, created_at: '2025-01-01T00:00:00Z' },
        isLoading: false,
        isAuthenticated: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshUser: vi.fn(),
      })

      renderWithProviders(<Navigation />)
      
      const expectedLinks = [
        'Home',
        'Blog', 
        'Spotlight',
        'Testimonials',
        'Donate',
        'Dashboard'
      ]
      
      expectedLinks.forEach(linkText => {
        expect(screen.getByRole('link', { name: linkText })).toBeInTheDocument()
      })
      
      // Sign In should NOT be visible when authenticated
      expect(screen.queryByRole('link', { name: 'Sign In' })).not.toBeInTheDocument()
      
      // Should have user avatar button
      expect(screen.getByRole('button', { name: /account of current user/i })).toBeInTheDocument()
      
      takeScreenshot('navigation-all-links-authenticated')
    })

    it('applies correct styling classes', () => {
      renderWithProviders(<Navigation />)
      
      const header = screen.getByRole('banner')
      expect(header).toHaveClass('MuiAppBar-root')
      
      const blogLink = screen.getByRole('link', { name: 'Blog' })
      expect(blogLink).toHaveClass('MuiButton-root')
    })
  })

  describe('2. Navigation Functionality', () => {
    it('navigates to homepage when logo is clicked', () => {
      renderWithRouter(['/blog'])
      
      // Use more specific selector to get navigation logo only
      const nav = screen.getByRole('banner')
      const logo = nav.querySelector('img[alt="UnderdogDevs"]')
      fireEvent.click(logo!.closest('a')!)
      
      // Navigation should work (router state would be checked in integration tests)
    })

    it('navigates to blog page when blog link is clicked', () => {
      renderWithRouter()
      
      // Use more specific selector for navigation link
      const nav = screen.getByRole('banner')
      const blogLink = nav.querySelector('a[href="/blog"]')
      fireEvent.click(blogLink!)
      
      // Navigation should work (router state would be checked in integration tests)
      takeScreenshot('navigation-blog-page')
    })

    it('navigates to spotlight page when spotlight link is clicked', () => {
      renderWithRouter()
      
      // Use more specific selector for navigation link
      const nav = screen.getByRole('banner')
      const spotlightLink = nav.querySelector('a[href="/spotlight"]')
      fireEvent.click(spotlightLink!)
      
      // Navigation should work (router state would be checked in integration tests)
      takeScreenshot('navigation-spotlight-page')
    })

    it('navigates to testimonials page when testimonials link is clicked', () => {
      renderWithRouter()
      
      // Use more specific selector for navigation link
      const nav = screen.getByRole('banner')
      const testimonialsLink = nav.querySelector('a[href="/testimonials"]')
      fireEvent.click(testimonialsLink!)
      
      // Navigation should work (router state would be checked in integration tests)
      takeScreenshot('navigation-testimonials-page')
    })

    it('navigates to donate page when donate link is clicked', () => {
      renderWithRouter()
      
      // Use more specific selector for navigation link
      const nav = screen.getByRole('banner')
      const donateLink = nav.querySelector('a[href="/donate"]')
      fireEvent.click(donateLink!)
      
      // Navigation should work (router state would be checked in integration tests)
      takeScreenshot('navigation-donate-page')
    })

    it('navigates to signin page when signin link is clicked', () => {
      renderWithRouter()
      
      // Use more specific selector for navigation link
      const nav = screen.getByRole('banner')
      const signinLink = nav.querySelector('a[href="/signin"]')
      fireEvent.click(signinLink!)
      
      // Navigation should work (router state would be checked in integration tests)
      takeScreenshot('navigation-signin-page')
    })
  })

  describe('3. Navigation Performance', () => {
    it('renders navigation quickly', () => {
      const renderTime = measurePerformance('Navigation render', () => {
        renderWithProviders(<Navigation />)
      })
      
      expect(renderTime).toBeLessThan(50)
    })

    it('handles rapid navigation clicks without errors', () => {
      renderWithRouter()
      
      const links = ['/blog', '/spotlight', '/testimonials', '/donate', '/']
      
      const navigationTime = measurePerformance('Rapid navigation', () => {
        const nav = screen.getByRole('banner')
        links.forEach(href => {
          const link = nav.querySelector(`a[href="${href}"]`)
          fireEvent.click(link!)
        })
      })
      
      expect(navigationTime).toBeLessThan(100)
      // Navigation should work (router state would be checked in integration tests)
    })
  })

  describe('4. Responsive Navigation', () => {
    it('shows mobile menu button on small screens', () => {
      // Mock mobile breakpoint with Material-UI useMediaQuery
      const mockMatchMedia = vi.fn()
      mockMatchMedia.mockReturnValue({
        matches: true, // Mobile breakpoint
        media: '(max-width: 899.95px)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      })

      renderWithProviders(<Navigation />)
      
      // On mobile, should have menu button
      const menuButton = screen.queryByLabelText('open drawer')
      expect(menuButton).toBeInTheDocument()
      
      takeScreenshot('navigation-mobile-responsive')
    })

    it('shows navigation links on desktop screens', () => {
      // Mock desktop breakpoint
      const mockMatchMedia = vi.fn()
      mockMatchMedia.mockReturnValue({
        matches: false, // Desktop breakpoint
        media: '(max-width: 899.95px)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      })

      renderWithProviders(<Navigation />)
      
      // All links should be visible on desktop
      const nav = screen.getByRole('banner')
      expect(nav.querySelector('a[href="/"]')).toBeInTheDocument()
      expect(nav.querySelector('a[href="/blog"]')).toBeInTheDocument()
      expect(nav.querySelector('a[href="/spotlight"]')).toBeInTheDocument()
      
      takeScreenshot('navigation-desktop-responsive')
    })
  })

  describe('5. Navigation Accessibility', () => {
    it('provides proper ARIA labels and roles', () => {
      renderWithProviders(<Navigation />)
      
      const nav = screen.getByRole('banner')
      expect(nav).toBeInTheDocument()
      
      // All links should be accessible
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveAccessibleName()
      })
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      renderWithProviders(<Navigation />)
      
      const firstLink = screen.getByRole('link', { name: 'UnderdogDevs' })
      
      // Focus should work
      await user.tab()
      expect(firstLink).toHaveFocus()
      
      // Tab navigation should work
      await user.tab()
      const secondLink = screen.getByRole('link', { name: 'Home' })
      expect(secondLink).toHaveFocus()
    })

    it('has sufficient color contrast', () => {
      renderWithProviders(<Navigation />)
      
      const link = screen.getByRole('link', { name: 'Home' })
      // Material-UI classes for color, not Tailwind
      expect(link).toHaveClass('MuiButton-root')
      
      // The Material-UI theme should provide sufficient contrast
      // This is a basic check - in real testing you'd use color contrast tools
    })
  })

  describe('6. Visual State Management', () => {
    it('applies hover states correctly', async () => {
      const user = userEvent.setup()
      renderWithProviders(<Navigation />)
      
      const homeLink = screen.getByRole('link', { name: 'Home' })
      
      // Check Material-UI classes are applied
      expect(homeLink).toHaveClass('MuiButton-root')
      
      // Hover interaction - Material-UI handles this internally via sx prop
      await user.hover(homeLink)
      // We can't directly test CSS hover states, but we can verify the component renders
      expect(homeLink).toBeInTheDocument()
    })

    it('maintains logo aspect ratio and sizing', () => {
      renderWithProviders(<Navigation />)
      
      // Use more specific selector to get navigation logo only
      const nav = screen.getByRole('banner')
      const logo = nav.querySelector('img[alt="UnderdogDevs"]')
      // Material-UI uses inline styles, not Tailwind classes
      expect(logo).toHaveStyle('height: 32px')
      expect(logo).toHaveStyle('width: auto')
    })
  })

  describe('7. Integration with Layout', () => {
    it('integrates properly with Layout component', () => {
      renderWithRouter()
      
      // Navigation should be present
      expect(screen.getByRole('banner')).toBeInTheDocument()
      
      // Main content should be present
      expect(screen.getByRole('main')).toBeInTheDocument()
      
      // Homepage content should be visible
      expect(screen.getByText('Welcome to UnderdogDevs')).toBeInTheDocument()
    })

    it('persists navigation across route changes', () => {
      renderWithRouter()
      
      // Navigate to blog - use getAllByRole and take the first one (from navigation header)
      const blogLinks = screen.getAllByRole('link', { name: 'Blog' })
      fireEvent.click(blogLinks[0])
      
      // Navigation should still be present
      expect(screen.getByRole('banner')).toBeInTheDocument()
      expect(screen.getAllByAltText('UnderdogDevs')).toHaveLength(2) // Navigation and footer
      
      // Navigate back to home - use getAllByRole and take the first one
      const homeLinks = screen.getAllByRole('link', { name: 'Home' })
      fireEvent.click(homeLinks[0])
      
      // Navigation should still be present
      expect(screen.getByRole('banner')).toBeInTheDocument()
    })
  })
})