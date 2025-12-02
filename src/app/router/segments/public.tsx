import { createAccessRoute } from '../route-factories'
import { rootRoute } from '../root'
import LandingPage from '@/app/pages/landing'
import AppLayout from '@/app/layout/AppLayout'
import HomePage from '@/app/pages'
import PublicLinkPage from '@/app/pages/public/public'

function AuthedHomePage() {
  return (
    <AppLayout>
      <HomePage />
    </AppLayout>
  )
}

export function getPublicRoutes() {
  const publicIndexRoute = createAccessRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    access: 'public',
    variants: { guest: LandingPage, authed: AuthedHomePage },
  })

  const publicLinkRoute = createAccessRoute({
    getParentRoute: () => rootRoute,
    path: '/public/$token',
    component: PublicLinkPage,
    access: 'public',
  })

  return publicIndexRoute.addChildren([publicLinkRoute])
}