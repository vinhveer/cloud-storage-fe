import { createRouter } from '@tanstack/react-router'
import { rootRoute, indexRoute } from './root'
import { getSamplesRoutes } from './segments/sample'

const routeTree = rootRoute.addChildren([
  indexRoute,
  getSamplesRoutes(),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}