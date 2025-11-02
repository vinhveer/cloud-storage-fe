import { createRoute } from '@tanstack/react-router'
import AppLayout from '@/app/layout/AppLayout'
import { rootRoute } from '../root'
import { getSamplesRoutes } from './sample'
import HomePage from '@/pages'

export const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app',
  component: AppLayout,
})

const appIndexRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/',
  component: HomePage,
})

export function getAppRoutes() {
  return appRoute.addChildren([
    appIndexRoute,
    getSamplesRoutes(appRoute),
  ])
}