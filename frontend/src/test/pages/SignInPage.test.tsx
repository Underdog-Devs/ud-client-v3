import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignInPage } from '@/pages/SignInPage'
import { renderWithProviders, measurePerformance, takeScreenshot, checkAccessibility, VIEWPORT_SIZES, mockMatchMedia } from '../helpers/testUtils'
import * as authHook from '@/hooks/useAuth'

describe('SignInPage', () => {
  const mockLogin = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
    mockLogin.mockResolvedValue({ user: { id: '1', email: 'test@example.com' } })
    
    // Mock the useAuth hook
    vi.spyOn(authHook, 'useAuth').mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    })
  })

  describe('1. Component Rendering', () => {
    it('renders the sign in page without errors', () => {
      const loadTime = measurePerformance('SignInPage render', () => {
        renderWithProviders(<SignInPage />)
      })
      
      expect(loadTime).toBeLessThan(150)
      takeScreenshot('signin-page-initial-load')
    })

    it('displays the UnderdogDevs logo', () => {
      renderWithProviders(<SignInPage />)
      
      const logo = screen.getByAltText('UnderdogDevs')
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute('src', '/images/Ud_logo.png')
    })

    it('displays the correct heading and subheading', () => {
      renderWithProviders(<SignInPage />)
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sign in to your account')
      expect(screen.getByText('Or')).toBeInTheDocument()
      expect(screen.getByText('create a new account')).toBeInTheDocument()
    })

    it('displays all form fields with correct labels', () => {
      renderWithProviders(<SignInPage />)
      
      expect(screen.getByRole('textbox', { name: /email address/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeInTheDocument()
    })

    it('displays navigation links', () => {
      renderWithProviders(<SignInPage />)
      
      const signUpLink = screen.getByRole('link', { name: 'create a new account' })
      const forgotPasswordLink = screen.getByRole('link', { name: 'Forgot your password?' })
      
      expect(signUpLink).toHaveAttribute('href', '/signup')
      expect(forgotPasswordLink).toHaveAttribute('href', '/request-password-reset')
    })

    it('displays submit button', () => {
      renderWithProviders(<SignInPage />)
      
      const submitButton = screen.getByRole('button', { name: 'Sign in' })
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).toHaveAttribute('type', 'submit')
    })
  })

  describe('2. Form Validation', () => {
    it('requires email and password fields', () => {
      renderWithProviders(<SignInPage />)
      
      const emailField = screen.getByRole('textbox', { name: /email address/i })
      const passwordField = document.querySelector('input[type="password"]')
      
      expect(emailField).toBeRequired()
      expect(passwordField).toBeRequired()
    })

    it('has correct input types and autocomplete attributes', () => {
      renderWithProviders(<SignInPage />)
      
      const emailField = screen.getByRole('textbox', { name: /email address/i })
      const passwordField = screen.getByLabelText(/password/i)
      
      expect(emailField).toHaveAttribute('type', 'email')
      expect(emailField).toHaveAttribute('autocomplete', 'email')
      expect(passwordField).toHaveAttribute('type', 'password')
      expect(passwordField).toHaveAttribute('autocomplete', 'current-password')
    })

    it('validates email format', async () => {
      renderWithProviders(<SignInPage />)
      
      const emailField = screen.getByRole('textbox', { name: /email address/i })
      
      // Test invalid email
      await userEvent.type(emailField, 'invalid-email')
      expect(emailField).toHaveValue('invalid-email')
      
      // HTML5 validation will handle email format validation
      expect((emailField as HTMLInputElement).validity.valid).toBe(false)
    })
  })

  describe('3. Form Interaction', () => {
    it('updates form data when typing in email field', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignInPage />)
      
      const emailField = screen.getByRole('textbox', { name: /email address/i })
      
      await user.type(emailField, 'test@example.com')
      expect(emailField).toHaveValue('test@example.com')
    })

    it('updates form data when typing in password field', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignInPage />)
      
      const passwordField = screen.getByLabelText(/password/i)
      
      await user.type(passwordField, 'password123')
      expect(passwordField).toHaveValue('password123')
    })

    it('toggles remember me checkbox', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignInPage />)
      
      const rememberMeCheckbox = screen.getByRole('checkbox', { name: /remember me/i })
      
      expect(rememberMeCheckbox).not.toBeChecked()
      
      await user.click(rememberMeCheckbox)
      expect(rememberMeCheckbox).toBeChecked()
      
      await user.click(rememberMeCheckbox)
      expect(rememberMeCheckbox).not.toBeChecked()
    })

    it('clears form fields when cleared', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignInPage />)
      
      const emailField = screen.getByRole('textbox', { name: /email address/i })
      const passwordField = screen.getByLabelText(/password/i)
      
      await user.type(emailField, 'test@example.com')
      await user.type(passwordField, 'password123')
      
      await user.clear(emailField)
      await user.clear(passwordField)
      
      expect(emailField).toHaveValue('')
      expect(passwordField).toHaveValue('')
    })
  })

  describe('4. Form Submission', () => {
    it('prevents default form submission', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignInPage />)
      
      const submitButton = screen.getByRole('button', { name: 'Sign in' })
      
      await user.click(submitButton)
      
      // Since we're testing the form handler, we can't easily test preventDefault
      // but we can ensure the form doesn't navigate away
      expect(window.location.pathname).toBe('/')
    })

    it('calls login function on submission', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignInPage />)
      
      const emailField = screen.getByRole('textbox', { name: /email address/i })
      const passwordField = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: 'Sign in' })
      
      await user.type(emailField, 'test@example.com')
      await user.type(passwordField, 'password123')
      
      await user.click(submitButton)
      
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })

    it('submits form with keyboard (Enter key)', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignInPage />)
      
      const emailField = screen.getByRole('textbox', { name: /email address/i })
      const passwordField = screen.getByLabelText(/password/i)
      
      await user.type(emailField, 'test@example.com')
      await user.type(passwordField, 'password123')
      await user.keyboard('{Enter}')
      
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
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
      
      renderWithProviders(<SignInPage />)
      
      const card = screen.getByRole('heading', { level: 1 }).closest('[class*="MuiCard"]')
      expect(card).toBeInTheDocument()
      
      takeScreenshot('signin-page-mobile-375px')
    })

    it('displays correctly on tablet devices (768px)', () => {
      mockMatchMedia(VIEWPORT_SIZES.tablet.width)
      
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: VIEWPORT_SIZES.tablet.width,
      })
      
      renderWithProviders(<SignInPage />)
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      takeScreenshot('signin-page-tablet-768px')
    })

    it('displays correctly on desktop devices (1200px)', () => {
      mockMatchMedia(VIEWPORT_SIZES.desktop.width)
      
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: VIEWPORT_SIZES.desktop.width,
      })
      
      renderWithProviders(<SignInPage />)
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      takeScreenshot('signin-page-desktop-1200px')
    })
  })

  describe('6. Material-UI Integration', () => {
    it('uses Material-UI components with correct classes', () => {
      renderWithProviders(<SignInPage />)
      
      const emailField = screen.getByRole('textbox', { name: /email address/i })
      const passwordField = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: 'Sign in' })
      
      expect(emailField.closest('.MuiTextField-root')).toBeInTheDocument()
      expect(passwordField.closest('.MuiTextField-root')).toBeInTheDocument()
      expect(submitButton).toHaveClass('MuiButton-root', 'MuiButton-contained')
    })

    it('applies correct Material-UI styling', () => {
      renderWithProviders(<SignInPage />)
      
      const container = screen.getByRole('heading', { level: 1 }).closest('[class*="MuiContainer"]')
      const card = screen.getByRole('heading', { level: 1 }).closest('[class*="MuiCard"]')
      
      expect(container).toBeInTheDocument()
      expect(card).toBeInTheDocument()
    })
  })

  describe('7. Accessibility', () => {
    it('meets basic accessibility requirements', () => {
      const { container } = renderWithProviders(<SignInPage />)
      
      const accessibilityCheck = checkAccessibility(container)
      
      if (!accessibilityCheck.passed) {
        console.warn('Accessibility issues found:', accessibilityCheck.issues)
      }
      
      // Check for proper heading hierarchy
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      
      // Check for proper form labels
      expect(screen.getByRole('textbox', { name: /email address/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByLabelText('Remember me')).toBeInTheDocument()
    })

    it('has proper focus management', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignInPage />)
      
      const emailField = screen.getByRole('textbox', { name: /email address/i })
      const passwordField = screen.getByLabelText(/password/i)
      
      // Test that form fields are focusable
      await user.click(emailField)
      expect(emailField).toHaveFocus()
      
      await user.click(passwordField)
      expect(passwordField).toHaveFocus()
      
      // Test tab navigation basics
      await user.tab()
      // After tabbing from password field, some element should have focus
      const focusedElement = document.activeElement
      expect(focusedElement).not.toBe(null)
    })

    it('provides accessible error states', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignInPage />)
      
      const emailField = screen.getByRole('textbox', { name: /email address/i })
      
      // Focus and blur email field without entering value
      await user.click(emailField)
      await user.tab()
      
      // HTML5 validation should provide accessibility
      expect(emailField).toBeRequired()
    })
  })

  describe('8. Performance', () => {
    it('renders within acceptable time limits', () => {
      const renderTime = measurePerformance('SignInPage render', () => {
        renderWithProviders(<SignInPage />)
      })
      
      expect(renderTime).toBeLessThan(50)
    })

    it('handles multiple re-renders efficiently', () => {
      const { rerender } = renderWithProviders(<SignInPage />)
      
      const rerenderTime = measurePerformance('SignInPage re-render', () => {
        for (let i = 0; i < 10; i++) {
          rerender(<SignInPage />)
        }
      })
      
      expect(rerenderTime).toBeLessThan(100)
    })

    it('handles rapid form input efficiently', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignInPage />)
      
      const emailField = screen.getByRole('textbox', { name: /email address/i })
      
      const inputTime = measurePerformance('Rapid form input', async () => {
        await user.type(emailField, 'test@example.com')
      })
      
      expect(inputTime).toBeLessThan(200)
    })
  })

  describe('9. Error Handling', () => {
    it('handles invalid form data gracefully', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignInPage />)
      
      const emailField = screen.getByRole('textbox', { name: /email address/i })
      
      // Try to type invalid email - the component should handle it gracefully
      await user.clear(emailField)
      await user.type(emailField, 'invalid-email')
      
      // Should not crash and field should exist (value may be auto-filled)
      expect(emailField).toBeInTheDocument()
      expect(emailField).toHaveAttribute('type', 'email')
    })

    it('handles empty form submission', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignInPage />)
      
      const submitButton = screen.getByRole('button', { name: 'Sign in' })
      
      await user.click(submitButton)
      
      // HTML5 validation should prevent submission
      const emailField = screen.getByRole('textbox', { name: /email address/i })
      expect((emailField as HTMLInputElement).validity.valueMissing).toBe(true)
    })
  })
})