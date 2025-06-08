import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api'
import type { HealthCheck, ApiInfo } from '@/types/api'

// Health check hook
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: async (): Promise<HealthCheck> => {
      const response = await apiClient.get('/health')
      return response.data
    },
    staleTime: 1000 * 30, // 30 seconds
  })
}

// API info hook
export const useApiInfo = () => {
  return useQuery({
    queryKey: ['apiInfo'],
    queryFn: async (): Promise<ApiInfo> => {
      const response = await apiClient.get('/api/info')
      return response.data
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}