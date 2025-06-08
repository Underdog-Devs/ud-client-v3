import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // In a real app, this would check authentication status
  // For testing purposes, we'll just render the children
  return <>{children}</>
}