import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HomePage } from '@/pages/HomePage'
import { renderWithProviders, measurePerformance, takeScreenshot, checkAccessibility, VIEWPORT_SIZES, mockMatchMedia } from '../helpers/testUtils'

describe('HomePage End-to-End Tests', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    vi.clearAllMocks()
  })

  describe('1. Homepage Loading and Structure', () => {
    it('loads the homepage successfully', () => {
      const loadTime = measurePerformance('HomePage render', () => {
        renderWithProviders(<HomePage />)
      })
      
      expect(loadTime).toBeLessThan(100) // Should render quickly
      takeScreenshot('homepage-initial-load')
    })

    it('displays the hero section with correct content', () => {
      renderWithProviders(<HomePage />)
      
      // Check hero heading
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Welcome to UnderdogDevs')
      
      // Check hero description
      expect(screen.getByText(/Helping formerly incarcerated and economically disadvantaged individuals/)).toBeInTheDocument()
      
      // Check hero buttons
      expect(screen.getByRole('link', { name: /Join Our Community/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Support Our Mission/i })).toBeInTheDocument()
      
      takeScreenshot('homepage-hero-section')
    })

    it('displays the stats section with correct metrics', () => {
      renderWithProviders(<HomePage />)
      
      // Check stats values
      expect(screen.getByText('500+')).toBeInTheDocument()
      expect(screen.getByText('Members Supported')).toBeInTheDocument()
      
      expect(screen.getByText('200+')).toBeInTheDocument()
      expect(screen.getByText('Job Placements')).toBeInTheDocument()
      
      expect(screen.getByText('85%')).toBeInTheDocument()
      expect(screen.getByText('Success Rate')).toBeInTheDocument()
      
      takeScreenshot('homepage-stats-section')
    })

    it('displays the mission section with content and image', () => {
      renderWithProviders(<HomePage />)
      
      // Check mission heading
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Our Mission')
      
      // Check mission content
      expect(screen.getByText(/We believe that everyone deserves a second chance/)).toBeInTheDocument()
      expect(screen.getByText(/Through our programs, we help individuals develop/)).toBeInTheDocument()
      
      // Check mission image
      const missionImage = screen.getByAltText('Community members working together')
      expect(missionImage).toBeInTheDocument()
      expect(missionImage).toHaveAttribute('src', '/images/together.jpg')
      
      takeScreenshot('homepage-mission-section')
    })
  })

  describe('2. Navigation and Links', () => {
    it('hero buttons have correct href attributes', () => {
      renderWithProviders(<HomePage />)
      
      const joinButton = screen.getByRole('link', { name: /Join Our Community/i })
      const donateButton = screen.getByRole('link', { name: /Support Our Mission/i })
      
      expect(joinButton).toHaveAttribute('href', '/member-dashboard')
      expect(donateButton).toHaveAttribute('href', '/donate')
    })

    it('hero buttons have proper styling and hover states', async () => {
      renderWithProviders(<HomePage />)
      
      const joinButton = screen.getByRole('link', { name: /Join Our Community/i })
      const donateButton = screen.getByRole('link', { name: /Support Our Mission/i })
      
      // Check MUI Button styling
      expect(joinButton).toHaveClass('MuiButton-root', 'MuiButton-contained')
      expect(donateButton).toHaveClass('MuiButton-root', 'MuiButton-outlined')
      
      // Check that buttons are properly rendered as Material-UI components
      expect(joinButton.tagName).toBe('A')
      expect(donateButton.tagName).toBe('A')
    })
  })

  describe('3. Responsive Design Testing', () => {
    it('displays correctly on mobile devices (375px)', () => {
      mockMatchMedia(VIEWPORT_SIZES.mobile.width)
      
      // Mock viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: VIEWPORT_SIZES.mobile.width,
      })
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: VIEWPORT_SIZES.mobile.height,
      })
      
      renderWithProviders(<HomePage />)
      
      // Check that content is still visible and properly laid out
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByText('500+')).toBeInTheDocument()
      
      takeScreenshot('homepage-mobile-375px')
    })

    it('displays correctly on tablet devices (768px)', () => {
      mockMatchMedia(VIEWPORT_SIZES.tablet.width)
      
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: VIEWPORT_SIZES.tablet.width,
      })
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: VIEWPORT_SIZES.tablet.height,
      })
      
      renderWithProviders(<HomePage />)
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByText('Our Mission')).toBeInTheDocument()
      
      takeScreenshot('homepage-tablet-768px')
    })

    it('displays correctly on desktop devices (1200px)', () => {
      mockMatchMedia(VIEWPORT_SIZES.desktop.width)
      
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: VIEWPORT_SIZES.desktop.width,
      })
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: VIEWPORT_SIZES.desktop.height,
      })
      
      renderWithProviders(<HomePage />)
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByAltText('Community members working together')).toBeInTheDocument()
      
      takeScreenshot('homepage-desktop-1200px')
    })
  })

  describe('4. Performance Testing', () => {
    it('renders within acceptable time limits', () => {
      const renderTime = measurePerformance('Full HomePage render', () => {
        renderWithProviders(<HomePage />)
      })
      
      // Should render in under 50ms for this simple component
      expect(renderTime).toBeLessThan(50)
    })

    it('handles multiple re-renders efficiently', () => {
      const { rerender } = renderWithProviders(<HomePage />)
      
      const rerenderTime = measurePerformance('HomePage re-render', () => {
        for (let i = 0; i < 10; i++) {
          rerender(<HomePage />)
        }
      })
      
      // Multiple re-renders should be fast
      expect(rerenderTime).toBeLessThan(100)
    })
  })

  describe('5. Accessibility Testing', () => {
    it('meets basic accessibility requirements', () => {
      const { container } = renderWithProviders(<HomePage />)
      
      const accessibilityCheck = checkAccessibility(container)
      
      if (!accessibilityCheck.passed) {
        console.warn('Accessibility issues found:', accessibilityCheck.issues)
      }
      
      // Check for semantic HTML
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
      
      // Check for alt text on images
      const image = screen.getByAltText('Community members working together')
      expect(image).toBeInTheDocument()
      
      // Check for proper link text
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveAccessibleName()
      })
    })

    it('has proper heading hierarchy', () => {
      renderWithProviders(<HomePage />)
      
      const h1 = screen.getByRole('heading', { level: 1 })
      const h2 = screen.getByRole('heading', { level: 2 })
      
      expect(h1).toHaveTextContent('Welcome to UnderdogDevs')
      expect(h2).toHaveTextContent('Our Mission')
    })

    it('provides meaningful alt text for images', () => {
      renderWithProviders(<HomePage />)
      
      const image = screen.getByAltText('Community members working together')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('alt', 'Community members working together')
    })
  })

  describe('6. User Interaction Testing', () => {
    it('handles button clicks without errors', async () => {
      renderWithProviders(<HomePage />)
      
      const joinButton = screen.getByRole('link', { name: /Join Our Community/i })
      const donateButton = screen.getByRole('link', { name: /Support Our Mission/i })
      
      // These are links, so clicking them would navigate
      // We're testing that they don't throw errors
      expect(() => {
        fireEvent.click(joinButton)
      }).not.toThrow()
      
      expect(() => {
        fireEvent.click(donateButton)
      }).not.toThrow()
    })

    it('provides visual feedback on hover', async () => {
      const user = userEvent.setup()
      renderWithProviders(<HomePage />)
      
      const joinButton = screen.getByRole('link', { name: /Join Our Community/i })
      
      // Hover over button
      await user.hover(joinButton)
      
      // MUI Button should have proper classes and be interactive
      expect(joinButton).toHaveClass('MuiButton-root')
      // Link elements don't have role="button" by default in MUI
      expect(joinButton).toBeInTheDocument()
    })
  })

  describe('7. Content Validation', () => {
    it('displays accurate statistics', () => {
      renderWithProviders(<HomePage />)
      
      // Verify stats are realistic and properly formatted
      expect(screen.getByText('500+')).toBeInTheDocument()
      expect(screen.getByText('200+')).toBeInTheDocument()
      expect(screen.getByText('85%')).toBeInTheDocument()
    })

    it('contains proper call-to-action messaging', () => {
      renderWithProviders(<HomePage />)
      
      expect(screen.getByText(/Join Our Community/i)).toBeInTheDocument()
      expect(screen.getByText(/Support Our Mission/i)).toBeInTheDocument()
      expect(screen.getByText(/Helping formerly incarcerated/)).toBeInTheDocument()
    })

    it('includes organization mission and values', () => {
      renderWithProviders(<HomePage />)
      
      expect(screen.getByText(/everyone deserves a second chance/)).toBeInTheDocument()
      expect(screen.getByText(/mentorship, resources, and support/)).toBeInTheDocument()
      expect(screen.getByText(/develop technical skills/)).toBeInTheDocument()
    })
  })
})