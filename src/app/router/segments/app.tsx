import { createAccessRoute } from '../route-factories'
import { redirect } from '@tanstack/react-router'
import AppLayout from '@/app/layout/AppLayout'
import { rootRoute } from '../root'
import HomePage from '@/app/pages'
import AccountSettingsPage from '@/app/pages/account-settings'

export const appRoute = createAccessRoute({
  getParentRoute: () => rootRoute,
  path: '/app',
  component: AppLayout,
  access: 'protected',
})

const appIndexRoute = createAccessRoute({
  getParentRoute: () => appRoute,
  path: '/',
  component: HomePage,
  access: 'protected',
  beforeLoad: () => {
    throw redirect({ to: '/' })
  },
})

const accountSettingsRoute = createAccessRoute({
  getParentRoute: () => appRoute,
  path: '/account-settings',
  component: AccountSettingsPage,
  access: 'protected',
})

export function getAppRoutes() {
  return appRoute.addChildren([
    appIndexRoute,
    accountSettingsRoute,
  ])
}