import { vi } from 'vitest'

export const mockUser = {
  id: 1,
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  is_active: true,
  is_verified: true,
  created_at: '2024-01-01T00:00:00Z',
  last_login: '2024-01-01T00:00:00Z',
}

export const mockToken = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  token_type: 'bearer',
  expires_in: 3600,
}

export const authService = {
  register: vi.fn().mockResolvedValue({ user: mockUser, message: 'User registered successfully' }),
  login: vi.fn().mockResolvedValue({ user: mockUser, token: mockToken, message: 'Login successful' }),
  getCurrentUser: vi.fn().mockResolvedValue(mockUser),
  refreshToken: vi.fn().mockResolvedValue(mockToken),
  logout: vi.fn().mockResolvedValue({ message: 'Logged out successfully' }),
  requestPasswordReset: vi.fn().mockResolvedValue({ message: 'Password reset email sent' }),
  confirmPasswordReset: vi.fn().mockResolvedValue({ message: 'Password reset successfully' }),
  changePassword: vi.fn().mockResolvedValue({ message: 'Password changed successfully' }),
  isAuthenticated: vi.fn().mockReturnValue(false),
  getAccessToken: vi.fn().mockReturnValue(null),
  getRefreshToken: vi.fn().mockReturnValue(null),
}