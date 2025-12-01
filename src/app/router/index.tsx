import { rootRoute } from './root'
import { getAppRoutes } from './segments/app'
import { getAuthRoutes } from './segments/auth'
import { getPublicRoutes } from './segments/public'
import { getVerificationRoutes } from './segments/verification'
import { getStorageRoutes } from './segments/storage'
import { getSamplesRoutes } from './segments/sample'
import { getAdminRoutes } from './segments/admin'
import { createAccessRoute } from './route-factories'
import NotFoundPage from '@/app/pages/not-found'

const notFoundRoute = createAccessRoute({
  getParentRoute: () => rootRoute,
  path: '$',
  component: NotFoundPage,
  access: 'public',
})

const routeTree = rootRoute.addChildren([
  getPublicRoutes(),
  getAppRoutes(),
  getAuthRoutes(),
  ...getStorageRoutes(),
  ...getVerificationRoutes(),
  getAdminRoutes(),
  getSamplesRoutes(),
  notFoundRoute,
])

import { createRouter } from '@tanstack/react-router'

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

