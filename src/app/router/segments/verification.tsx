import { createAccessRoute } from '../route-factories'
import { rootRoute } from '../root'
import EmailVerifiedPage from '@/app/pages/auth/email-verified'
import ResetPasswordPage from '@/app/pages/auth/reset-password'

export function getVerificationRoutes() {
  const emailVerifiedRoute = createAccessRoute({
    getParentRoute: () => rootRoute,
    path: '/email-verified',
    component: EmailVerifiedPage,
    access: 'public',
  })

  const resetPasswordRoute = createAccessRoute({
    getParentRoute: () => rootRoute,
    path: '/reset-password',
    component: ResetPasswordPage,
    access: 'public',
  })

  return [
    emailVerifiedRoute,
    resetPasswordRoute,
  ]
}


