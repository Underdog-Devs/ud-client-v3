import { apiClient } from '../lib/api'

export interface User {
  id: number
  email: string
  first_name?: string
  last_name?: string
  is_active: boolean
  is_verified: boolean
  created_at: string
  last_login?: string
  role_name?: string
  bio?: string
  location?: string
  website?: string
  github_username?: string
  linkedin_url?: string
  avatar_url?: string
}

export interface Token {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface UserCreateRequest {
  email: string
  password: string
  first_name?: string
  last_name?: string
}

export interface UserLoginRequest {
  email: string
  password: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordReset {
  token: string
  new_password: string
}

export interface ChangePassword {
  current_password: string
  new_password: string
}

export interface RegisterResponse {
  user: User
  message: string
}

export interface LoginResponse {
  user: User
  token: Token
  message: string
}

export interface MessageResponse {
  message: string
}

export class AuthService {
  async register(userData: UserCreateRequest): Promise<RegisterResponse> {
    const response = await apiClient.post('/auth/register', userData)
    return response.data
  }

  async login(credentials: UserLoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/login', credentials)
    
    // Store tokens in localStorage
    const { token } = response.data
    localStorage.setItem('access_token', token.access_token)
    localStorage.setItem('refresh_token', token.refresh_token)
    
    return response.data
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/auth/me')
    return response.data
  }

  async refreshToken(): Promise<Token> {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await apiClient.post('/auth/refresh', {
      refresh_token: refreshToken
    })

    // Update stored tokens
    const newTokens = response.data
    localStorage.setItem('access_token', newTokens.access_token)
    localStorage.setItem('refresh_token', newTokens.refresh_token)

    return newTokens
  }

  async logout(): Promise<MessageResponse> {
    try {
      const response = await apiClient.post('/auth/logout')
      return response.data
    } finally {
      // Always clear tokens, even if API call fails
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  }

  async requestPasswordReset(email: string): Promise<MessageResponse> {
    const response = await apiClient.post('/auth/password-reset/request', {
      email
    })
    return response.data
  }

  async confirmPasswordReset(token: string, newPassword: string): Promise<MessageResponse> {
    const response = await apiClient.post('/auth/password-reset/confirm', {
      token,
      new_password: newPassword
    })
    return response.data
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<MessageResponse> {
    const response = await apiClient.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    })
    return response.data
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token')
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token')
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token')
  }
}

export const authService = new AuthService()