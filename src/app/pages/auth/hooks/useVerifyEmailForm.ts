import React from 'react'
import { useResendVerificationEmail } from '@/api/features/auth/auth.mutations'
import { useAuthFormSubmission } from './useAuthFormSubmission'
import { ResendVerificationRequestSchema } from '@/api/features/auth/auth.schemas'
import { ZodError } from 'zod'
import { useAlert } from '@/components/Alert'

export function useVerifyEmailForm() {
  const [email, setEmail] = React.useState('')
  const resendVerificationMutation = useResendVerificationEmail()
  const { showAlert } = useAlert()

  const { handleSubmit, isPending } = useAuthFormSubmission({
    mutation: resendVerificationMutation,
    onSuccess: {
      heading: 'Email Sent',
      message: 'Verification email has been resent, please check your inbox.',
      duration: 5000,
    },
    onError: {
      heading: 'Failed to Send',
      message: 'Failed to resend verification email, please try again.',
      duration: 5000,
    },
  })

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
      setEmail(emailFromQuery)
    } else if (emailFromStorage) {
      setEmail(emailFromStorage)
    }
  }, [])

  const handleResend = React.useCallback(async () => {
    if (!email.trim()) {
      showAlert({
        type: 'error',
        heading: 'Validation Error',
        message: 'Please enter your email address.',
        duration: 5000
      })
      return
    }

    try {
      ResendVerificationRequestSchema.parse({
        email: email.trim(),
      })
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map(issue => issue.message).join('\n')
        showAlert({
          type: 'error',
          heading: 'Validation Error',
          message: errorMessages,
          duration: 5000
        })
        return
      }
    }

    await handleSubmit({ email: email.trim() })
  }, [email, handleSubmit, showAlert])

  const hasAutoResentRef = React.useRef(false)

  React.useEffect(() => {
    if (!email || hasAutoResentRef.current) {
      return
    }

    hasAutoResentRef.current = true
    void handleResend()
  }, [email, handleResend])

  return {
    email,
    setEmail,
    handleResend,
    isPending,
  }
}

