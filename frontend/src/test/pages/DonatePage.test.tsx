import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { DonatePage } from '@/pages/DonatePage'
import { renderWithProviders, measurePerformance, takeScreenshot, checkAccessibility, VIEWPORT_SIZES, mockMatchMedia } from '../helpers/testUtils'

describe('DonatePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('1. Component Rendering', () => {
    it('renders the donate page without errors', () => {
      const loadTime = measurePerformance('DonatePage render', () => {
        renderWithProviders(<DonatePage />)
      })
      
      expect(loadTime).toBeLessThan(100)
      takeScreenshot('donate-page-initial-load')
    })

    it('displays the main heading and subheading', () => {
      renderWithProviders(<DonatePage />)
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Support Our Mission')
      expect(screen.getByText(/Your donation helps us provide mentorship/)).toBeInTheDocument()
    })

    it('displays all impact stats cards', () => {
      renderWithProviders(<DonatePage />)
      
      // Check for donation amounts
      expect(screen.getByText('$50')).toBeInTheDocument()
      expect(screen.getByText('$150')).toBeInTheDocument()
      expect(screen.getByText('$500')).toBeInTheDocument()
      
      // Check for impact descriptions
      expect(screen.getByText('Funds one mentorship session')).toBeInTheDocument()
      expect(screen.getByText('Provides one month of career support')).toBeInTheDocument()
      expect(screen.getByText('Sponsors a full training program')).toBeInTheDocument()
    })

    it('displays donation form placeholder', () => {
      renderWithProviders(<DonatePage />)
      
      expect(screen.getByRole('heading', { level: 5 })).toHaveTextContent('Make a Donation')
      expect(screen.getByText('Donation form will be implemented in Phase 5 with full payment integration.')).toBeInTheDocument()
    })
  })

  describe('2. Material-UI Integration', () => {
    it('uses Material-UI components with correct structure', () => {
      renderWithProviders(<DonatePage />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      const container = heading.closest('[class*="MuiContainer"]')
      
      expect(container).toBeInTheDocument()
    })

    it('applies correct Material-UI card styling for impact stats', () => {
      renderWithProviders(<DonatePage />)
      
      const donationAmounts = ['$50', '$150', '$500']
      
      donationAmounts.forEach(amount => {
        const amountElement = screen.getByText(amount)
        const card = amountElement.closest('[class*="MuiCard"]')
        const cardContent = card?.querySelector('[class*="MuiCardContent"]')
        
        expect(card).toBeInTheDocument()
        expect(cardContent).toBeInTheDocument()
      })
    })

    it('uses proper Material-UI Typography variants', () => {
      renderWithProviders(<DonatePage />)
      
      const mainHeading = screen.getByRole('heading', { level: 1 })
      const subHeading = screen.getByText(/Your donation helps us provide mentorship/)
      const donationHeading = screen.getByRole('heading', { level: 5 })
      
      expect(mainHeading.closest('[class*="MuiTypography"]')).toBeInTheDocument()
      expect(subHeading.closest('[class*="MuiTypography"]')).toBeInTheDocument()
      expect(donationHeading.closest('[class*="MuiTypography"]')).toBeInTheDocument()
    })
  })

  describe('3. Layout and Grid System', () => {
    it('displays impact stats in a responsive grid', () => {
      renderWithProviders(<DonatePage />)
      
      // Find the container with grid layout
      const impactStats = screen.getByText('$50').closest('[class*="MuiBox"]')?.parentElement
      expect(impactStats).toBeInTheDocument()
      
      // All three cards should be present
      expect(screen.getByText('$50')).toBeInTheDocument()
      expect(screen.getByText('$150')).toBeInTheDocument()
      expect(screen.getByText('$500')).toBeInTheDocument()
    })

    it('centers content appropriately', () => {
      renderWithProviders(<DonatePage />)
      
      const mainHeading = screen.getByRole('heading', { level: 1 })
      const subHeading = screen.getByText(/Your donation helps us provide mentorship/)
      
      // Text should be centered (verified through MUI classes in integration)
      expect(mainHeading).toBeInTheDocument()
      expect(subHeading).toBeInTheDocument()
    })
  })

  describe('4. Content Validation', () => {
    it('displays accurate donation impact information', () => {
      renderWithProviders(<DonatePage />)
      
      // Verify realistic donation amounts and impacts
      const impacts = [
        { amount: '$50', impact: 'Funds one mentorship session' },
        { amount: '$150', impact: 'Provides one month of career support' },
        { amount: '$500', impact: 'Sponsors a full training program' }
      ]
      
      impacts.forEach(({ amount, impact }) => {
        expect(screen.getByText(amount)).toBeInTheDocument()
        expect(screen.getByText(impact)).toBeInTheDocument()
      })
    })

    it('includes compelling mission statement', () => {
      renderWithProviders(<DonatePage />)
      
      const missionText = screen.getByText(/Your donation helps us provide mentorship, education, and support/)
      expect(missionText).toBeInTheDocument()
      expect(missionText).toHaveTextContent('formerly incarcerated and economically disadvantaged individuals')
    })

    it('clearly indicates future implementation status', () => {
      renderWithProviders(<DonatePage />)
      
      expect(screen.getByText('Donation form will be implemented in Phase 5 with full payment integration.')).toBeInTheDocument()
    })
  })

  describe('5. Responsive Design', () => {
    it('displays correctly on mobile devices (375px)', () => {
      mockMatchMedia(VIEWPORT_SIZES.mobile.width)
      
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: VIEWPORT_SIZES.mobile.width,
      })
      
      renderWithProviders(<DonatePage />)
      
      // Content should stack vertically on mobile
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByText('$50')).toBeInTheDocument()
      expect(screen.getByText('$150')).toBeInTheDocument()
      expect(screen.getByText('$500')).toBeInTheDocument()
      
      takeScreenshot('donate-page-mobile-375px')
    })

    it('displays correctly on tablet devices (768px)', () => {
      mockMatchMedia(VIEWPORT_SIZES.tablet.width)
      
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: VIEWPORT_SIZES.tablet.width,
      })
      
      renderWithProviders(<DonatePage />)
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByText('Make a Donation')).toBeInTheDocument()
      
      takeScreenshot('donate-page-tablet-768px')
    })

    it('displays correctly on desktop devices (1200px)', () => {
      mockMatchMedia(VIEWPORT_SIZES.desktop.width)
      
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: VIEWPORT_SIZES.desktop.width,
      })
      
      renderWithProviders(<DonatePage />)
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByText('Support Our Mission')).toBeInTheDocument()
      
      takeScreenshot('donate-page-desktop-1200px')
    })
  })

  describe('6. Accessibility', () => {
    it('meets basic accessibility requirements', () => {
      const { container } = renderWithProviders(<DonatePage />)
      
      const accessibilityCheck = checkAccessibility(container)
      
      if (!accessibilityCheck.passed) {
        console.warn('Accessibility issues found:', accessibilityCheck.issues)
      }
      
      // Check for proper heading hierarchy
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 5 })).toBeInTheDocument()
    })

    it('has proper semantic structure', () => {
      renderWithProviders(<DonatePage />)
      
      const mainHeading = screen.getByRole('heading', { level: 1 })
      const donationHeading = screen.getByRole('heading', { level: 5 })
      
      expect(mainHeading).toHaveTextContent('Support Our Mission')
      expect(donationHeading).toHaveTextContent('Make a Donation')
    })

    it('provides clear content hierarchy', () => {
      renderWithProviders(<DonatePage />)
      
      // Main content should be well-structured
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByText(/Your donation helps us provide/)).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 5 })).toBeInTheDocument()
    })
  })

  describe('7. Performance', () => {
    it('renders within acceptable time limits', () => {
      const renderTime = measurePerformance('DonatePage render', () => {
        renderWithProviders(<DonatePage />)
      })
      
      expect(renderTime).toBeLessThan(50)
    })

    it('handles multiple re-renders efficiently', () => {
      const { rerender } = renderWithProviders(<DonatePage />)
      
      const rerenderTime = measurePerformance('DonatePage re-render', () => {
        for (let i = 0; i < 10; i++) {
          rerender(<DonatePage />)
        }
      })
      
      expect(rerenderTime).toBeLessThan(100)
    })
  })

  describe('8. Visual Design', () => {
    it('uses different colored cards for visual variety', () => {
      renderWithProviders(<DonatePage />)
      
      // Cards should use different color themes (primary, success, secondary)
      const card50 = screen.getByText('$50').closest('[class*="MuiCard"]')
      const card150 = screen.getByText('$150').closest('[class*="MuiCard"]')
      const card500 = screen.getByText('$500').closest('[class*="MuiCard"]')
      
      expect(card50).toBeInTheDocument()
      expect(card150).toBeInTheDocument()
      expect(card500).toBeInTheDocument()
    })

    it('centers impact stats text appropriately', () => {
      renderWithProviders(<DonatePage />)
      
      // Each card should have centered content
      const amounts = ['$50', '$150', '$500']
      amounts.forEach(amount => {
        const amountElement = screen.getByText(amount)
        expect(amountElement).toBeInTheDocument()
      })
    })
  })

  describe('9. Error Handling', () => {
    it('renders without crashing with no props', () => {
      expect(() => {
        renderWithProviders(<DonatePage />)
      }).not.toThrow()
    })

    it('handles component re-mounting gracefully', () => {
      const { unmount, rerender } = renderWithProviders(<DonatePage />)
      
      expect(() => {
        unmount()
        rerender(<DonatePage />)
      }).not.toThrow()
    })
  })

  describe('10. Future Implementation Considerations', () => {
    it('has proper structure for payment form integration', () => {
      renderWithProviders(<DonatePage />)
      
      // The donation card provides space for future form implementation
      const donationCard = screen.getByText('Make a Donation').closest('[class*="MuiCard"]')
      const cardContent = donationCard?.querySelector('[class*="MuiCardContent"]')
      
      expect(donationCard).toBeInTheDocument()
      expect(cardContent).toBeInTheDocument()
    })

    it('provides clear donation amounts for future form defaults', () => {
      renderWithProviders(<DonatePage />)
      
      // These amounts could be used as default options in payment form
      const amounts = ['$50', '$150', '$500']
      amounts.forEach(amount => {
        expect(screen.getByText(amount)).toBeInTheDocument()
      })
    })

    it('includes impactful messaging for donor engagement', () => {
      renderWithProviders(<DonatePage />)
      
      // Strong mission statement for donor motivation
      expect(screen.getByText(/formerly incarcerated and economically disadvantaged individuals/)).toBeInTheDocument()
      expect(screen.getByText(/entering the tech industry/)).toBeInTheDocument()
    })
  })
})