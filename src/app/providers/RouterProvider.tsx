import { RouterProvider as TanStackRouterProvider } from '@tanstack/react-router'
import { router } from '../router'

export default function RouterProvider() {
  return <TanStackRouterProvider router={router} />
}


