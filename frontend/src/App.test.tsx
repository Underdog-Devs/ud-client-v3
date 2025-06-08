import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

// Create a test wrapper with QueryClient
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
      {children}
    </QueryClientProvider>
  )
}

describe('App', () => {
  it('renders UnderdogDevs heading', () => {
    render(<App />, { wrapper: TestWrapper })
    
    expect(screen.getByText('UnderdogDevs - React Frontend')).toBeInTheDocument()
  })

  it('renders health check section', () => {
    render(<App />, { wrapper: TestWrapper })
    
    expect(screen.getByText('Backend Health Check')).toBeInTheDocument()
  })

  it('renders API info section', () => {
    render(<App />, { wrapper: TestWrapper })
    
    expect(screen.getByText('API Information')).toBeInTheDocument()
  })
})