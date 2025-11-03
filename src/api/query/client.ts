import { QueryClient } from '@tanstack/react-query'
import { AppError } from '../core/error'

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) {
    return false
  }
  if (error instanceof AppError) {
    const nonRetryStatuses = new Set([400, 401, 403, 404])
    if (error.status && nonRetryStatuses.has(error.status)) {
      return false
    }
  }
  return true
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      staleTime: 60_000,
      gcTime: 300_000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})


