import { createRouter, NotFoundRoute } from '@tanstack/react-router'
import { rootRoute } from './root'
import { getAppRoutes } from './segments/app'
import { getAuthRoutes } from './segments/auth'
import { getPublicRoutes } from './segments/public'
import { getVerificationRoutes } from './segments/verification'
import { getStorageRoutes } from './segments/storage'
import { getSamplesRoutes } from './segments/sample'
import { getAdminRoutes } from './segments/admin'
import RedirectToHome from '@/app/pages/redirects/RedirectToHome'

const routeTree = rootRoute.addChildren([
  getPublicRoutes(),
  getAppRoutes(),
  getAuthRoutes(),
  ...getStorageRoutes(),
  ...getVerificationRoutes(),
  getSamplesRoutes(),
  getAdminRoutes(),
])

const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: RedirectToHome,
})

export const router = createRouter({ routeTree, notFoundRoute })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}