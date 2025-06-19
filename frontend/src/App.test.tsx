import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import * as authHook from '@/hooks/useAuth'
import App from './App'

// Create a test wrapper with QueryClient and AuthProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={testQueryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock the useAuth hook
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

  it('renders UnderdogDevs heading', () => {
    render(<App />, { wrapper: TestWrapper })
    
    expect(screen.getByText('Welcome to UnderdogDevs')).toBeInTheDocument()
  })

  it('renders homepage content', () => {
    render(<App />, { wrapper: TestWrapper })
    
    expect(screen.getByText(/break into the tech industry through mentorship, education, and community support/)).toBeInTheDocument()
  })

  it('renders navigation', () => {
    render(<App />, { wrapper: TestWrapper })
    
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })
})