import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { theme } from '@/theme'
import { AuthProvider } from '@/contexts/AuthContext'

// Shared test query client to reduce resource usage
let sharedTestQueryClient: QueryClient | null = null

const getTestQueryClient = () => {
  if (!sharedTestQueryClient) {
    sharedTestQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 0,
          gcTime: 0,
        },
        mutations: {
          retry: false,
        },
      },
    })
  }
  return sharedTestQueryClient
}

// Create a test wrapper with all necessary providers
export const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const testQueryClient = getTestQueryClient()

  return (
    <QueryClientProvider client={testQueryClient}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}