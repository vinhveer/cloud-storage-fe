import { createAccessRoute } from '../route-factories'
import { rootRoute } from '../root'
import LandingPage from '@/app/pages/landing'
import AppLayout from '@/app/layout/AppLayout'
import HomePage from '@/app/pages'

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

  return publicIndexRoute
}