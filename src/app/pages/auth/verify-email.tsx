import React from 'react'
import { Link } from '@tanstack/react-router'
import FormCard from '@/components/FormCard/FormCard'
import { Button } from '@/components/Button/Button'
import { useResendVerificationEmail } from '@/api/features/auth/auth.mutations'
import { AppError } from '@/api/core/error'
import { useAlert } from '@/components/Alert'

export default function VerifyEmailPage() {
  const [email, setEmail] = React.useState('')
  const resendVerificationMutation = useResendVerificationEmail()
  const { showAlert } = useAlert()

  React.useEffect(() => {
    if (globalThis.window === undefined) {
      return
    }

    const params = new URLSearchParams(globalThis.window.location.search)
    const emailFromQuery = params.get('email')
    const emailFromStorage = (() => {
      try {
        return globalThis.window.sessionStorage.getItem('cloud-storage.lastLoginEmail')
      } catch {
        return null
      }
    })()

    if (emailFromQuery) {
      // eslint-disable-next-line no-console
      console.log('[VERIFY_EMAIL] found email in query', emailFromQuery)
      setEmail(emailFromQuery)
    } else if (emailFromStorage) {
      // eslint-disable-next-line no-console
      console.log('[VERIFY_EMAIL] found email in sessionStorage', emailFromStorage)
      setEmail(emailFromStorage)
    } else {
      // eslint-disable-next-line no-console
      console.log('[VERIFY_EMAIL] no email in query or storage', globalThis.window.location.search)
    }
  }, [])

  const hasAutoResentRef = React.useRef(false)

  React.useEffect(() => {
    if (!email || hasAutoResentRef.current) {
      return
    }

    hasAutoResentRef.current = true
    // eslint-disable-next-line no-console
    console.log('[VERIFY_EMAIL] auto resend once with email', email)
    // Automatically resend verification email once when landing on page if email is available
    void handleResend()
  }, [email])

  async function handleResend() {
    if (!email || resendVerificationMutation.isPending) {
      return
    }

    // eslint-disable-next-line no-console
    console.log('[VERIFY_EMAIL] handleResend called with email', email)

    try {
      const response = await resendVerificationMutation.mutateAsync({ email })
      showAlert({
        type: 'success',
        message: response.message || 'Verification email has been resent, please check your inbox.',
        duration: 5000
      })
    } catch (unknownError) {
      const applicationError = unknownError as AppError
      showAlert({
        type: 'error',
        message: applicationError.message || 'Failed to resend verification email, please try again.',
        duration: 5000
      })
    }
  }

  return (
    <FormCard
      title="Verify Email"
      subtitle="Complete the account verification step to continue using the service"
      footer={(
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already verified?{' '}
          <Link to="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline">Back to login</Link>
        </p>
      )}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          We have sent an email containing a verification link to your email address.
          Please check your inbox (or Spam folder) and click on the link in the email to activate your account.
        </p>

        <div className="space-y-2">
          <label
            htmlFor="verify-email-input"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            id="verify-email-input"
            type="email"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            placeholder="you@example.com"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
        </div>

        <div className="pt-2">
          <Button
            onClick={handleResend}
            variant="primary"
            size="lg"
            isLoading={resendVerificationMutation.isPending}
            loadingText="Resending..."
            disabled={!email}
          >
            Resend verification email
          </Button>
        </div>
      </div>
    </FormCard>
  )
}


