import { createRootRoute, Outlet } from '@tanstack/react-router'
import { AlertProvider } from '@/components/Alert/AlertProvider'
import { useEffect } from 'react'
import { useLocation } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'

function RouteDataRefresher() {
  const location = useLocation()
  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.invalidateQueries({
      refetchType: 'active',
    })
  }, [location.pathname, queryClient])

  return null
}

export const rootRoute = createRootRoute({
    component: () => (
        <AlertProvider>
            <RouteDataRefresher />
            <Outlet />
        </AlertProvider>
    ),
})