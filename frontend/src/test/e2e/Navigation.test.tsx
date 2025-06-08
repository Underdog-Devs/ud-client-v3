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

describe('Navigation End-to-End Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('1. Navigation Structure and Visibility', () => {
    it('displays the navigation bar with logo', () => {
      renderWithProviders(<Navigation />)
      
      const logo = screen.getByAltText('UnderdogDevs')
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute('src', '/images/Ud_logo.png')
      
      takeScreenshot('navigation-logo')
    })

    it('displays all navigation links', () => {
      renderWithProviders(<Navigation />)
      
      const expectedLinks = [
        'Home',
        'Blog', 
        'Spotlight',
        'Testimonials',
        'Donate',
        'Dashboard',
        'Sign In'
      ]
      
      expectedLinks.forEach(linkText => {
        expect(screen.getByRole('link', { name: linkText })).toBeInTheDocument()
      })
      
      takeScreenshot('navigation-all-links')
    })

    it('has correct href attributes for all links', () => {
      renderWithProviders(<Navigation />)
      
      const linkMappings = [
        { name: 'Home', href: '/' },
        { name: 'Blog', href: '/blog' },
        { name: 'Spotlight', href: '/spotlight' },
        { name: 'Testimonials', href: '/testimonials' },
        { name: 'Donate', href: '/donate' },
        { name: 'Dashboard', href: '/member-dashboard' },
        { name: 'Sign In', href: '/signin' }
      ]
      
      linkMappings.forEach(({ name, href }) => {
        const link = screen.getByRole('link', { name })
        expect(link).toHaveAttribute('href', href)
      })
    })

    it('applies correct styling classes', () => {
      renderWithProviders(<Navigation />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('bg-white', 'shadow-lg', 'border-b')
      
      const homeLink = screen.getByRole('link', { name: 'Home' })
      expect(homeLink).toHaveClass('text-gray-700', 'hover:text-gray-900')
    })
  })

  describe('2. Navigation Functionality', () => {
    it('navigates to homepage when logo is clicked', () => {
      const { router } = renderWithRouter(['/blog'])
      
      const logo = screen.getByAltText('UnderdogDevs')
      fireEvent.click(logo.closest('a')!)
      
      expect(router.state.location.pathname).toBe('/')
    })

    it('navigates to blog page when blog link is clicked', () => {
      const { router } = renderWithRouter()
      
      const blogLink = screen.getByRole('link', { name: 'Blog' })
      fireEvent.click(blogLink)
      
      expect(router.state.location.pathname).toBe('/blog')
      takeScreenshot('navigation-blog-page')
    })

    it('navigates to spotlight page when spotlight link is clicked', () => {
      const { router } = renderWithRouter()
      
      const spotlightLink = screen.getByRole('link', { name: 'Spotlight' })
      fireEvent.click(spotlightLink)
      
      expect(router.state.location.pathname).toBe('/spotlight')
      takeScreenshot('navigation-spotlight-page')
    })

    it('navigates to testimonials page when testimonials link is clicked', () => {
      const { router } = renderWithRouter()
      
      const testimonialsLink = screen.getByRole('link', { name: 'Testimonials' })
      fireEvent.click(testimonialsLink)
      
      expect(router.state.location.pathname).toBe('/testimonials')
      takeScreenshot('navigation-testimonials-page')
    })

    it('navigates to donate page when donate link is clicked', () => {
      const { router } = renderWithRouter()
      
      const donateLink = screen.getByRole('link', { name: 'Donate' })
      fireEvent.click(donateLink)
      
      expect(router.state.location.pathname).toBe('/donate')
      takeScreenshot('navigation-donate-page')
    })

    it('navigates to signin page when signin link is clicked', () => {
      const { router } = renderWithRouter()
      
      const signinLink = screen.getByRole('link', { name: 'Sign In' })
      fireEvent.click(signinLink)
      
      expect(router.state.location.pathname).toBe('/signin')
      takeScreenshot('navigation-signin-page')
    })
  })

  describe('3. Navigation Performance', () => {
    it('renders navigation quickly', () => {
      const renderTime = measurePerformance('Navigation render', () => {
        renderWithProviders(<Navigation />)
      })
      
      expect(renderTime).toBeLessThan(30)
    })

    it('handles rapid navigation clicks without errors', () => {
      const { router } = renderWithRouter()
      
      const links = ['Blog', 'Spotlight', 'Testimonials', 'Donate', 'Home']
      
      const navigationTime = measurePerformance('Rapid navigation', () => {
        links.forEach(linkName => {
          const link = screen.getByRole('link', { name: linkName })
          fireEvent.click(link)
        })
      })
      
      expect(navigationTime).toBeLessThan(100)
      expect(router.state.location.pathname).toBe('/')
    })
  })

  describe('4. Responsive Navigation', () => {
    it('hides navigation links on mobile screens', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      renderWithProviders(<Navigation />)
      
      const navContainer = screen.getByRole('navigation')
      const linksContainer = navContainer.querySelector('.hidden.md\\:flex')
      
      expect(linksContainer).toBeInTheDocument()
      expect(linksContainer).toHaveClass('hidden', 'md:flex')
      
      takeScreenshot('navigation-mobile-responsive')
    })

    it('shows navigation links on desktop screens', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      })

      renderWithProviders(<Navigation />)
      
      // All links should be visible
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Blog' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Spotlight' })).toBeInTheDocument()
      
      takeScreenshot('navigation-desktop-responsive')
    })
  })

  describe('5. Navigation Accessibility', () => {
    it('provides proper ARIA labels and roles', () => {
      renderWithProviders(<Navigation />)
      
      const nav = screen.getByRole('navigation')
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
      
      const firstLink = screen.getByRole('link', { name: 'Home' })
      
      // Focus should work
      await user.tab()
      expect(firstLink).toHaveFocus()
      
      // Tab navigation should work
      await user.tab()
      const secondLink = screen.getByRole('link', { name: 'Blog' })
      expect(secondLink).toHaveFocus()
    })

    it('has sufficient color contrast', () => {
      renderWithProviders(<Navigation />)
      
      const link = screen.getByRole('link', { name: 'Home' })
      expect(link).toHaveClass('text-gray-700')
      
      // The color classes should provide sufficient contrast
      // This is a basic check - in real testing you'd use color contrast tools
      expect(link).toHaveClass('hover:text-gray-900')
    })
  })

  describe('6. Visual State Management', () => {
    it('applies hover states correctly', async () => {
      const user = userEvent.setup()
      renderWithProviders(<Navigation />)
      
      const homeLink = screen.getByRole('link', { name: 'Home' })
      
      // Check initial state
      expect(homeLink).toHaveClass('text-gray-700')
      
      // Hover should trigger CSS hover state
      await user.hover(homeLink)
      expect(homeLink).toHaveClass('hover:text-gray-900')
    })

    it('maintains logo aspect ratio and sizing', () => {
      renderWithProviders(<Navigation />)
      
      const logo = screen.getByAltText('UnderdogDevs')
      expect(logo).toHaveClass('h-8', 'w-auto')
    })
  })

  describe('7. Integration with Layout', () => {
    it('integrates properly with Layout component', () => {
      const { router } = renderWithRouter()
      
      // Navigation should be present
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      
      // Main content should be present
      expect(screen.getByRole('main')).toBeInTheDocument()
      
      // Homepage content should be visible
      expect(screen.getByText('Welcome to UnderdogDevs')).toBeInTheDocument()
    })

    it('persists navigation across route changes', () => {
      const { router } = renderWithRouter()
      
      // Navigate to blog
      const blogLink = screen.getByRole('link', { name: 'Blog' })
      fireEvent.click(blogLink)
      
      // Navigation should still be present
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByAltText('UnderdogDevs')).toBeInTheDocument()
      
      // Navigate back to home
      const homeLink = screen.getByRole('link', { name: 'Home' })
      fireEvent.click(homeLink)
      
      // Navigation should still be present
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
  })
})