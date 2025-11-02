import { createRoute } from '@tanstack/react-router'
import AuthLayout from '@/app/layout/AuthLayout'
import LoginPage from '@/pages/auth/login'
import RegisterPage from '@/pages/auth/register'
import { rootRoute } from '../root'

export function getAuthRoutes() {
  const authRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auth',
    component: AuthLayout,
  })

  const loginRoute = createRoute({
    getParentRoute: () => authRoute,
    path: 'login',
    component: LoginPage,
  })

  const registerRoute = createRoute({
    getParentRoute: () => authRoute,
    path: 'register',
    component: RegisterPage,
  })

  return authRoute.addChildren([
    loginRoute,
    registerRoute,
  ])
}