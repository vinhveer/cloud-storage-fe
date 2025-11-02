import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../root'
import PublicHomePage from '@/pages/home'

export function getPublicRoutes() {
  const publicIndexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: PublicHomePage,
  })

  return publicIndexRoute
}