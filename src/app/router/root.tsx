import { createRootRoute, createRoute } from '@tanstack/react-router'
import AppLayout from '@/app/layout/AppLayout'
import HomePage from '@/pages'

export const rootRoute = createRootRoute({
  component: AppLayout,
})

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})