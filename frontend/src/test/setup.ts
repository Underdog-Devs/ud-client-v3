import '@testing-library/jest-dom'
import { vi, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Mock window.matchMedia for responsive testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(() => null),
}
Object.defineProperty(global, 'localStorage', { value: localStorageMock })

// Mock authentication service
vi.mock('@/services/auth', () => {
  return {
    authService: {
      register: vi.fn().mockResolvedValue({ user: { id: 1, email: 'test@example.com' }, message: 'Success' }),
      login: vi.fn().mockResolvedValue({ user: { id: 1, email: 'test@example.com' }, token: { access_token: 'token' }, message: 'Success' }),
      getCurrentUser: vi.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
      refreshToken: vi.fn().mockResolvedValue({ access_token: 'new-token' }),
      logout: vi.fn().mockResolvedValue({ message: 'Logged out' }),
      requestPasswordReset: vi.fn().mockResolvedValue({ message: 'Reset email sent' }),
      confirmPasswordReset: vi.fn().mockResolvedValue({ message: 'Password reset' }),
      changePassword: vi.fn().mockResolvedValue({ message: 'Password changed' }),
      isAuthenticated: vi.fn().mockReturnValue(false),
      getAccessToken: vi.fn().mockReturnValue(null),
      getRefreshToken: vi.fn().mockReturnValue(null),
    }
  }
})

// Mock token manager
vi.mock('@/utils/tokenManager', () => ({
  tokenManager: {
    ensureValidToken: vi.fn().mockResolvedValue(null),
    refreshToken: vi.fn().mockResolvedValue(undefined),
    isTokenExpired: vi.fn().mockReturnValue(false),
    getTimeUntilExpiry: vi.fn().mockReturnValue(3600000),
  }
}))

// Clean up after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})