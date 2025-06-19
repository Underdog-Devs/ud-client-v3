// Note: We'll access authService methods directly to avoid circular imports

interface TokenRefreshConfig {
  maxRetries: number
  retryDelay: number
}

class TokenManager {
  private refreshPromise: Promise<void> | null = null
  private config: TokenRefreshConfig = {
    maxRetries: 3,
    retryDelay: 1000,
  }

  constructor() {
    this.setupTokenRefresh()
  }

  private setupTokenRefresh() {
    // Check token expiration every minute
    setInterval(() => {
      this.checkAndRefreshToken()
    }, 60000)
  }

  private async checkAndRefreshToken() {
    const token = localStorage.getItem('access_token')
    if (!token) return

    try {
      // Decode token to check expiration (without verification)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expirationTime = payload.exp * 1000 // Convert to milliseconds
      const currentTime = Date.now()
      const timeUntilExpiry = expirationTime - currentTime

      // Refresh token if it expires within 5 minutes
      if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
        await this.refreshToken()
      }
    } catch (error) {
      console.error('Error checking token expiration:', error)
    }
  }

  async refreshToken(retryCount = 0): Promise<void> {
    // If a refresh is already in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = this.performTokenRefresh(retryCount)
    
    try {
      await this.refreshPromise
    } finally {
      this.refreshPromise = null
    }
  }

  private async performTokenRefresh(retryCount: number): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      // Import API client dynamically to avoid circular imports
      const { apiClient } = await import('@/lib/api')
      const response = await apiClient.post('/auth/refresh', {
        refresh_token: refreshToken
      })

      // Update stored tokens
      const newTokens = response.data
      localStorage.setItem('access_token', newTokens.access_token)
      localStorage.setItem('refresh_token', newTokens.refresh_token)
    } catch (error: unknown) {
      console.error('Token refresh failed:', error)

      // If it's a 401 error, the refresh token is invalid
      if ((error as { response?: { status?: number } }).response?.status === 401) {
        this.clearTokens()
        window.location.href = '/signin'
        return
      }

      // Retry on other errors
      if (retryCount < this.config.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay))
        return this.performTokenRefresh(retryCount + 1)
      }

      // Max retries exceeded
      this.clearTokens()
      window.location.href = '/signin'
    }
  }

  private clearTokens() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  // Method to manually trigger token refresh (for API interceptors)
  async ensureValidToken(): Promise<string | null> {
    const token = localStorage.getItem('access_token')
    if (!token) return null

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expirationTime = payload.exp * 1000
      const currentTime = Date.now()

      // If token expires within 1 minute, refresh it
      if (expirationTime - currentTime < 60 * 1000) {
        await this.refreshToken()
        return localStorage.getItem('access_token')
      }

      return token
    } catch (error) {
      console.error('Error validating token:', error)
      return null
    }
  }

  // Check if token is expired
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expirationTime = payload.exp * 1000
      return Date.now() >= expirationTime
    } catch {
      return true
    }
  }

  // Get time until token expires (in milliseconds)
  getTimeUntilExpiry(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expirationTime = payload.exp * 1000
      return Math.max(0, expirationTime - Date.now())
    } catch {
      return 0
    }
  }
}

export const tokenManager = new TokenManager()