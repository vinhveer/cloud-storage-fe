import { createAccessRoute } from '../route-factories'
import AuthLayout from '@/app/layout/AuthLayout'
import LoginPage from '@/app/pages/auth/login'
import RegisterPage from '@/app/pages/auth/register'
import VerifyEmailPage from '@/app/pages/auth/verify-email'
import ForgotPasswordPage from '@/app/pages/auth/forgot-password'
import ResetPasswordPage from '@/app/pages/auth/reset-password'
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

  const verifyEmailRoute = createAccessRoute({
    getParentRoute: () => authRoute,
    path: 'verify-email',
    component: VerifyEmailPage,
    access: 'guestOnly',
  })

  const forgotPasswordRoute = createAccessRoute({
    getParentRoute: () => authRoute,
    path: 'forgot-password',
    component: ForgotPasswordPage,
    access: 'guestOnly',
  })

  const resetPasswordRoute = createAccessRoute({
    getParentRoute: () => authRoute,
    path: 'reset-password',
    component: ResetPasswordPage,
    access: 'guestOnly',
  })

  return authRoute.addChildren([
    loginRoute,
    registerRoute,
    verifyEmailRoute,
    forgotPasswordRoute,
    resetPasswordRoute,
  ])
}