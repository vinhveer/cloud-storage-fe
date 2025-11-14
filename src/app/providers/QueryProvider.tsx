import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { queryClient } from '@/api/query/client'

type QueryProviderProps = {
  children: ReactNode
}

export default function QueryProvider({ children }: Readonly<QueryProviderProps>) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

