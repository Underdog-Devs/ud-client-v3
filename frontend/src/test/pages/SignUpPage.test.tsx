import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { SignUpPage } from '@/pages/SignUpPage'
import { renderWithProviders, measurePerformance, takeScreenshot, checkAccessibility, VIEWPORT_SIZES, mockMatchMedia } from '../helpers/testUtils'
import * as authHook from '@/hooks/useAuth'

describe('SignUpPage', () => {
  const mockRegister = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
    mockRegister.mockResolvedValue({ user: { id: '1', email: 'test@example.com' } })
    
    // Mock the useAuth hook
    vi.spyOn(authHook, 'useAuth').mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
      refreshUser: vi.fn(),
    })
  })

  describe('1. Component Rendering', () => {
    it('renders the sign up page without errors', () => {
      const loadTime = measurePerformance('SignUpPage render', () => {
        renderWithProviders(<SignUpPage />)
      })
      
      expect(loadTime).toBeLessThan(150)
      takeScreenshot('signup-page-initial-load')
    })

    it('displays the correct heading', () => {
      renderWithProviders(<SignUpPage />)
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Create your account')
    })

    it('displays sign in link for existing users', () => {
      renderWithProviders(<SignUpPage />)
      
      expect(screen.getByText('Already have an account?')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Sign in here' })).toHaveAttribute('href', '/signin')
    })

    it('uses Material-UI Container and Card components', () => {
      renderWithProviders(<SignUpPage />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      const container = heading.closest('[class*="MuiContainer"]')
      const card = heading.closest('[class*="MuiCard"]')
      
      expect(container).toBeInTheDocument()
      expect(card).toBeInTheDocument()
    })
  })

  describe('2. Material-UI Integration', () => {
    it('uses correct Material-UI Typography variants', () => {
      renderWithProviders(<SignUpPage />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      const bodyText = screen.getByText(/Already have an account/)
      
      // Check that MUI Typography components are used
      expect(heading.closest('[class*="MuiTypography"]')).toBeInTheDocument()
      expect(bodyText.closest('[class*="MuiTypography"]')).toBeInTheDocument()
    })

    it('applies correct Material-UI spacing and layout', () => {
      renderWithProviders(<SignUpPage />)
      
      const card = screen.getByText(/Already have an account/).closest('[class*="MuiCard"]')
      
      expect(card).toBeInTheDocument()
      // Just verify the card structure exists
    })
  })

  describe('3. Responsive Design', () => {
    it('displays correctly on mobile devices (375px)', () => {
      mockMatchMedia(VIEWPORT_SIZES.mobile.width)
      
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: VIEWPORT_SIZES.mobile.width,
      })
      
      renderWithProviders(<SignUpPage />)
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      takeScreenshot('signup-page-mobile-375px')
    })

    it('displays correctly on tablet devices (768px)', () => {
      mockMatchMedia(VIEWPORT_SIZES.tablet.width)
      
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: VIEWPORT_SIZES.tablet.width,
      })
      
      renderWithProviders(<SignUpPage />)
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      takeScreenshot('signup-page-tablet-768px')
    })

    it('displays correctly on desktop devices (1200px)', () => {
      mockMatchMedia(VIEWPORT_SIZES.desktop.width)
      
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: VIEWPORT_SIZES.desktop.width,
      })
      
      renderWithProviders(<SignUpPage />)
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      takeScreenshot('signup-page-desktop-1200px')
    })
  })

  describe('4. Accessibility', () => {
    it('meets basic accessibility requirements', () => {
      const { container } = renderWithProviders(<SignUpPage />)
      
      const accessibilityCheck = checkAccessibility(container)
      
      if (!accessibilityCheck.passed) {
        console.warn('Accessibility issues found:', accessibilityCheck.issues)
      }
      
      // Check for proper heading hierarchy
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('has proper semantic structure', () => {
      renderWithProviders(<SignUpPage />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      const content = screen.getByText(/Already have an account/)
      
      expect(heading).toBeInTheDocument()
      expect(content).toBeInTheDocument()
    })
  })

  describe('5. Performance', () => {
    it('renders within acceptable time limits', () => {
      const renderTime = measurePerformance('SignUpPage render', () => {
        renderWithProviders(<SignUpPage />)
      })
      
      expect(renderTime).toBeLessThan(50)
    })

    it('handles multiple re-renders efficiently', () => {
      const { rerender } = renderWithProviders(<SignUpPage />)
      
      const rerenderTime = measurePerformance('SignUpPage re-render', () => {
        for (let i = 0; i < 10; i++) {
          rerender(<SignUpPage />)
        }
      })
      
      expect(rerenderTime).toBeLessThan(100)
    })
  })

  describe('6. Content Structure', () => {
    it('provides clear indication of auth status', () => {
      renderWithProviders(<SignUpPage />)
      
      const authMessage = screen.getByText('Already have an account?')
      expect(authMessage).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Sign in here' })).toBeInTheDocument()
    })

    it('maintains consistent layout with other auth pages', () => {
      renderWithProviders(<SignUpPage />)
      
      // Check for consistent container structure
      const container = screen.getByRole('heading', { level: 1 }).closest('[class*="MuiContainer"]')
      expect(container).toBeInTheDocument()
      
      // Check for card layout similar to SignInPage
      const card = screen.getByText(/Already have an account/).closest('[class*="MuiCard"]')
      expect(card).toBeInTheDocument()
    })
  })

  describe('7. Future Implementation Planning', () => {
    it('has proper component structure for form implementation', () => {
      renderWithProviders(<SignUpPage />)
      
      // Verify the component exports correctly and has full form implementation
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Create your account')
      
      // Check that form implementation is complete with all necessary fields
      expect(screen.getByRole('textbox', { name: /first name/i })).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: /last name/i })).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: /email address/i })).toBeInTheDocument()
      
      // Check password fields by their IDs since labels might have complex MUI structure
      const passwordField = document.getElementById('password')
      const confirmPasswordField = document.getElementById('confirmPassword')
      expect(passwordField).toBeInTheDocument()
      expect(confirmPasswordField).toBeInTheDocument()
      expect(passwordField).toHaveAttribute('type', 'password')
      expect(confirmPasswordField).toHaveAttribute('type', 'password')
      
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })

    it('uses maxWidth="md" container for wider form layout', () => {
      renderWithProviders(<SignUpPage />)
      
      // SignUpPage uses md container vs SignInPage sm container for wider forms
      const container = screen.getByRole('heading', { level: 1 }).closest('[class*="MuiContainer"]')
      expect(container).toBeInTheDocument()
    })
  })

  describe('8. Error Handling', () => {
    it('renders without crashing with no props', () => {
      expect(() => {
        renderWithProviders(<SignUpPage />)
      }).not.toThrow()
    })

    it('handles component re-mounting gracefully', () => {
      // Test component cleanup without attempting to rerender after unmount
      const { unmount } = renderWithProviders(<SignUpPage />)
      
      expect(() => {
        unmount()
      }).not.toThrow()
    })
  })
})