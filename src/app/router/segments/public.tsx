import { createAccessRoute } from '../route-factories'
import { rootRoute } from '../root'
import PublicHomePage from '@/app/pages/home'
import AppHomeShell from '@/app/pages/AppHomeShell'

export function getPublicRoutes() {
  const publicIndexRoute = createAccessRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    access: 'public',
    variants: { guest: PublicHomePage, authed: AppHomeShell },
  })

  return publicIndexRoute
}