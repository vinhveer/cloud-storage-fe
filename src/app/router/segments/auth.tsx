import { createAccessRoute } from '../route-factories'
import AuthLayout from '@/app/layout/AuthLayout'
import LoginPage from '@/app/pages/auth/login'
import RegisterPage from '@/app/pages/auth/register'
import { rootRoute } from '../root'

export function getAuthRoutes() {
  const authRoute = createAccessRoute({
    getParentRoute: () => rootRoute,
    path: '/auth',
    component: AuthLayout,
    access: 'guestOnly',
  })

  const loginRoute = createAccessRoute({
    getParentRoute: () => authRoute,
    path: 'login',
    component: LoginPage,
    access: 'guestOnly',
  })

  const registerRoute = createAccessRoute({
    getParentRoute: () => authRoute,
    path: 'register',
    component: RegisterPage,
    access: 'guestOnly',
  })

  return authRoute.addChildren([
    loginRoute,
    registerRoute,
  ])
}