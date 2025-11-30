import React from 'react'
import { useForgotPassword } from '@/api/features/auth/auth.mutations'
import { useAuthFormSubmission } from './useAuthFormSubmission'
import { ForgotPasswordRequestSchema } from '@/api/features/auth/auth.schemas'
import { ZodError } from 'zod'
import { useAlert } from '@/components/Alert'

export function useForgotPasswordForm() {
  const [email, setEmail] = React.useState('')
  const forgotPasswordMutation = useForgotPassword()
  const { showAlert } = useAlert()

  const { handleSubmit, isPending } = useAuthFormSubmission({
    mutation: forgotPasswordMutation,
    onSuccess: {
      heading: 'Email Sent',
      message: 'If an account exists for this email, you will receive password reset instructions.',
      duration: 5000,
    },
    onError: {
      heading: 'Request Failed',
      message: 'Failed to send reset link. Please try again.',
      duration: 0,
    },
  })

  const handleForgotPassword = React.useCallback(async () => {
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
      ForgotPasswordRequestSchema.parse({
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

  return {
    email,
    setEmail,
    handleForgotPassword,
    isPending,
  }
}

