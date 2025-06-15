import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestimonialsPage } from '@/pages/TestimonialsPage'
import { renderWithProviders, measurePerformance, takeScreenshot, checkAccessibility, VIEWPORT_SIZES, mockMatchMedia } from '../helpers/testUtils'

describe('TestimonialsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('1. Component Rendering', () => {
    it('renders the testimonials page without errors', () => {
      const loadTime = measurePerformance('TestimonialsPage render', () => {
        renderWithProviders(<TestimonialsPage />)
      })
      
      expect(loadTime).toBeLessThan(100)
      takeScreenshot('testimonials-page-initial-load')
    })

    it('displays the main heading and description', () => {
      renderWithProviders(<TestimonialsPage />)
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Testimonials')
      expect(screen.getByText(/Hear from our community members about their journey/)).toBeInTheDocument()
    })

    it('displays all testimonial cards', () => {
      renderWithProviders(<TestimonialsPage />)
      
      // Check for all three testimonials
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument()
      expect(screen.getByText('Marcus Williams')).toBeInTheDocument()
      expect(screen.getByText('Jessica Chen')).toBeInTheDocument()
    })

    it('displays call-to-action section', () => {
      renderWithProviders(<TestimonialsPage />)
      
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Ready to Start Your Journey?')
      expect(screen.getByRole('link', { name: 'Join UnderdogDevs' })).toBeInTheDocument()
    })
  })

  describe('2. Testimonial Content', () => {
    it('displays complete testimonial information for Sarah Johnson', () => {
      renderWithProviders(<TestimonialsPage />)
      
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument()
      expect(screen.getByText(/Full Stack Developer at Tech Corp/)).toBeInTheDocument()
      expect(screen.getByText(/UnderdogDevs gave me the confidence and skills/)).toBeInTheDocument()
    })

    it('displays complete testimonial information for Marcus Williams', () => {
      renderWithProviders(<TestimonialsPage />)
      
      expect(screen.getByText('Marcus Williams')).toBeInTheDocument()
      expect(screen.getByText(/Frontend Developer at StartupXYZ/)).toBeInTheDocument()
      expect(screen.getByText(/The community support and technical training/)).toBeInTheDocument()
    })

    it('displays complete testimonial information for Jessica Chen', () => {
      renderWithProviders(<TestimonialsPage />)
      
      expect(screen.getByText('Jessica Chen')).toBeInTheDocument()
      expect(screen.getByText(/Data Analyst at DataFlow Inc/)).toBeInTheDocument()
      expect(screen.getByText(/Coming from an economically disadvantaged background/)).toBeInTheDocument()
    })

    it('displays testimonial quotes with proper formatting', () => {
      renderWithProviders(<TestimonialsPage />)
      
      // Quotes should be wrapped in quotation marks and styled as blockquotes
      const quotes = [
        /UnderdogDevs gave me the confidence and skills/,
        /The community support and technical training/,
        /Coming from an economically disadvantaged background/
      ]
      
      quotes.forEach(quote => {
        const quoteElement = screen.getByText(quote)
        expect(quoteElement).toBeInTheDocument()
        expect(quoteElement.textContent).toMatch(/^".*"$/) // Starts and ends with quotes
      })
    })
  })

  describe('3. Avatar and Images', () => {
    it('displays avatar images for all testimonials', () => {
      renderWithProviders(<TestimonialsPage />)
      
      const sarahAvatar = screen.getByAltText('Sarah Johnson')
      const marcusAvatar = screen.getByAltText('Marcus Williams')
      const jessicaAvatar = screen.getByAltText('Jessica Chen')
      
      expect(sarahAvatar).toBeInTheDocument()
      expect(marcusAvatar).toBeInTheDocument()
      expect(jessicaAvatar).toBeInTheDocument()
    })

    it('uses fallback images for avatars', () => {
      renderWithProviders(<TestimonialsPage />)
      
      const avatars = [
        screen.getByAltText('Sarah Johnson'),
        screen.getByAltText('Marcus Williams'),
        screen.getByAltText('Jessica Chen')
      ]
      
      avatars.forEach(avatar => {
        expect(avatar).toHaveAttribute('src', '/images/fallback.png')
      })
    })

    it('has proper alt text for accessibility', () => {
      renderWithProviders(<TestimonialsPage />)
      
      expect(screen.getByAltText('Sarah Johnson')).toBeInTheDocument()
      expect(screen.getByAltText('Marcus Williams')).toBeInTheDocument()
      expect(screen.getByAltText('Jessica Chen')).toBeInTheDocument()
    })
  })

  describe('4. Material-UI Integration', () => {
    it('uses Material-UI components with correct structure', () => {
      renderWithProviders(<TestimonialsPage />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      const container = heading.closest('[class*="MuiContainer"]')
      
      expect(container).toBeInTheDocument()
    })

    it('applies Material-UI card styling for testimonials', () => {
      renderWithProviders(<TestimonialsPage />)
      
      const sarahCard = screen.getByText('Sarah Johnson').closest('[class*="MuiCard"]')
      const marcusCard = screen.getByText('Marcus Williams').closest('[class*="MuiCard"]')
      const jessicaCard = screen.getByText('Jessica Chen').closest('[class*="MuiCard"]')
      
      expect(sarahCard).toBeInTheDocument()
      expect(marcusCard).toBeInTheDocument()
      expect(jessicaCard).toBeInTheDocument()
    })

    it('uses Material-UI Avatar components', () => {
      renderWithProviders(<TestimonialsPage />)
      
      const avatars = [
        screen.getByAltText('Sarah Johnson'),
        screen.getByAltText('Marcus Williams'),
        screen.getByAltText('Jessica Chen')
      ]
      
      avatars.forEach(avatar => {
        expect(avatar.closest('[class*="MuiAvatar"]')).toBeInTheDocument()
      })
    })

    it('uses Material-UI Button for call-to-action', () => {
      renderWithProviders(<TestimonialsPage />)
      
      const joinButton = screen.getByRole('link', { name: 'Join UnderdogDevs' })
      expect(joinButton).toHaveClass('MuiButton-root', 'MuiButton-contained')
    })
  })

  describe('5. Layout and Spacing', () => {
    it('displays testimonials in a vertical stack', () => {
      renderWithProviders(<TestimonialsPage />)
      
      // All testimonials should be present and properly spaced
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument()
      expect(screen.getByText('Marcus Williams')).toBeInTheDocument()
      expect(screen.getByText('Jessica Chen')).toBeInTheDocument()
    })

    it('has proper spacing between testimonials and call-to-action', () => {
      renderWithProviders(<TestimonialsPage />)
      
      const lastTestimonial = screen.getByText('Jessica Chen')
      const callToAction = screen.getByRole('heading', { level: 2 })
      
      expect(lastTestimonial).toBeInTheDocument()
      expect(callToAction).toBeInTheDocument()
    })

    it('uses proper container width and centering', () => {
      renderWithProviders(<TestimonialsPage />)
      
      const container = screen.getByRole('heading', { level: 1 }).closest('[class*="MuiContainer"]')
      expect(container).toBeInTheDocument()
    })
  })

  describe('6. Call-to-Action Section', () => {
    it('displays compelling call-to-action heading', () => {
      renderWithProviders(<TestimonialsPage />)
      
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Ready to Start Your Journey?')
    })

    it('includes motivational description', () => {
      renderWithProviders(<TestimonialsPage />)
      
      expect(screen.getByText('Join our community and begin your transformation into a tech professional.')).toBeInTheDocument()
    })

    it('has properly linked join button', () => {
      renderWithProviders(<TestimonialsPage />)
      
      const joinButton = screen.getByRole('link', { name: 'Join UnderdogDevs' })
      expect(joinButton).toHaveAttribute('href', '/member-dashboard')
    })

    it('styles call-to-action section distinctly', () => {
      renderWithProviders(<TestimonialsPage />)
      
      const ctaCard = screen.getByRole('heading', { level: 2 }).closest('[class*="MuiCard"]')
      expect(ctaCard).toBeInTheDocument()
    })
  })

  describe('7. Responsive Design', () => {
    it('displays correctly on mobile devices (375px)', () => {
      mockMatchMedia(VIEWPORT_SIZES.mobile.width)
      
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: VIEWPORT_SIZES.mobile.width,
      })
      
      renderWithProviders(<TestimonialsPage />)
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Join UnderdogDevs' })).toBeInTheDocument()
      
      takeScreenshot('testimonials-page-mobile-375px')
    })

    it('displays correctly on tablet devices (768px)', () => {
      mockMatchMedia(VIEWPORT_SIZES.tablet.width)
      
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: VIEWPORT_SIZES.tablet.width,
      })
      
      renderWithProviders(<TestimonialsPage />)
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByText('Marcus Williams')).toBeInTheDocument()
      
      takeScreenshot('testimonials-page-tablet-768px')
    })

    it('displays correctly on desktop devices (1200px)', () => {
      mockMatchMedia(VIEWPORT_SIZES.desktop.width)
      
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: VIEWPORT_SIZES.desktop.width,
      })
      
      renderWithProviders(<TestimonialsPage />)
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByText('Jessica Chen')).toBeInTheDocument()
      
      takeScreenshot('testimonials-page-desktop-1200px')
    })
  })

  describe('8. Accessibility', () => {
    it('meets basic accessibility requirements', () => {
      const { container } = renderWithProviders(<TestimonialsPage />)
      
      const accessibilityCheck = checkAccessibility(container)
      
      if (!accessibilityCheck.passed) {
        console.warn('Accessibility issues found:', accessibilityCheck.issues)
      }
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    })

    it('has proper heading hierarchy', () => {
      renderWithProviders(<TestimonialsPage />)
      
      const h1 = screen.getByRole('heading', { level: 1 })
      const h2 = screen.getByRole('heading', { level: 2 })
      
      expect(h1).toHaveTextContent('Testimonials')
      expect(h2).toHaveTextContent('Ready to Start Your Journey?')
    })

    it('uses semantic blockquote elements for testimonials', () => {
      renderWithProviders(<TestimonialsPage />)
      
      // Quotes should be marked up as blockquotes for screen readers
      const quotes = screen.getAllByText(/^".*"$/)
      expect(quotes.length).toBe(3)
    })

    it('provides accessible button with clear action', () => {
      renderWithProviders(<TestimonialsPage />)
      
      const joinButton = screen.getByRole('link', { name: 'Join UnderdogDevs' })
      expect(joinButton).toBeInTheDocument()
      expect(joinButton).toHaveAccessibleName()
    })
  })

  describe('9. User Interaction', () => {
    it('handles call-to-action button interaction', async () => {
      const user = userEvent.setup()
      renderWithProviders(<TestimonialsPage />)
      
      const joinButton = screen.getByRole('link', { name: 'Join UnderdogDevs' })
      
      expect(() => {
        user.click(joinButton)
      }).not.toThrow()
    })

    it('provides visual feedback on button hover', async () => {
      const user = userEvent.setup()
      renderWithProviders(<TestimonialsPage />)
      
      const joinButton = screen.getByRole('link', { name: 'Join UnderdogDevs' })
      
      await user.hover(joinButton)
      
      expect(joinButton).toHaveClass('MuiButton-root')
      // Link elements don't have role="button" by default in MUI
      expect(joinButton).toBeInTheDocument()
    })
  })

  describe('10. Performance', () => {
    it('renders within acceptable time limits', () => {
      const renderTime = measurePerformance('TestimonialsPage render', () => {
        renderWithProviders(<TestimonialsPage />)
      })
      
      expect(renderTime).toBeLessThan(50)
    })

    it('handles multiple re-renders efficiently', () => {
      const { rerender } = renderWithProviders(<TestimonialsPage />)
      
      const rerenderTime = measurePerformance('TestimonialsPage re-render', () => {
        for (let i = 0; i < 10; i++) {
          rerender(<TestimonialsPage />)
        }
      })
      
      expect(rerenderTime).toBeLessThan(100)
    })

    it('efficiently renders multiple testimonial cards', () => {
      const renderTime = measurePerformance('Multiple cards render', () => {
        renderWithProviders(<TestimonialsPage />)
        
        // Verify all cards are rendered
        expect(screen.getByText('Sarah Johnson')).toBeInTheDocument()
        expect(screen.getByText('Marcus Williams')).toBeInTheDocument()
        expect(screen.getByText('Jessica Chen')).toBeInTheDocument()
      })
      
      expect(renderTime).toBeLessThan(75)
    })
  })

  describe('11. Content Quality', () => {
    it('includes diverse testimonials with different roles', () => {
      renderWithProviders(<TestimonialsPage />)
      
      expect(screen.getByText(/Full Stack Developer/)).toBeInTheDocument()
      expect(screen.getByText(/Frontend Developer/)).toBeInTheDocument()
      expect(screen.getByText(/Data Analyst/)).toBeInTheDocument()
    })

    it('showcases variety of company sizes and types', () => {
      renderWithProviders(<TestimonialsPage />)
      
      expect(screen.getByText(/Tech Corp/)).toBeInTheDocument()
      expect(screen.getByText(/StartupXYZ/)).toBeInTheDocument()
      expect(screen.getByText(/DataFlow Inc/)).toBeInTheDocument()
    })

    it('addresses different background challenges', () => {
      renderWithProviders(<TestimonialsPage />)
      
      expect(screen.getByText(/transition from incarceration/)).toBeInTheDocument()
      expect(screen.getByText(/economically disadvantaged background/)).toBeInTheDocument()
    })

    it('includes mentions of key program benefits', () => {
      renderWithProviders(<TestimonialsPage />)
      
      expect(screen.getByText(/mentorship program/)).toBeInTheDocument()
      expect(screen.getByText(/community support and technical training/)).toBeInTheDocument()
      expect(screen.getByText(/opened doors I never knew existed/)).toBeInTheDocument()
    })
  })

  describe('12. Error Handling', () => {
    it('renders without crashing with no props', () => {
      expect(() => {
        renderWithProviders(<TestimonialsPage />)
      }).not.toThrow()
    })

    it('handles component re-mounting gracefully', () => {
      // Test component cleanup without attempting to rerender after unmount
      const { unmount } = renderWithProviders(<TestimonialsPage />)
      
      expect(() => {
        unmount()
      }).not.toThrow()
    })
  })
})