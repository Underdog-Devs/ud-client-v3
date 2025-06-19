import { createContext } from 'react'
import type { User, LoginResponse, RegisterResponse } from '../services/auth'

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<LoginResponse>
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<RegisterResponse>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)