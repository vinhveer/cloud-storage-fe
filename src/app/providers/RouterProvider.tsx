import { RouterProvider as TanStackRouterProvider } from '@tanstack/react-router'
import { router } from '../router'
import { useSetupUserRole } from '@/hooks/useSetupUserRole'

function RouterContent() {
  // Setup user role on app init
  useSetupUserRole()

  return <TanStackRouterProvider router={router} />
}

export default function RouterProvider() {
  return <RouterContent />
}