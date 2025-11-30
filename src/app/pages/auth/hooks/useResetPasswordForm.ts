import React from 'react'
import { useSearch } from '@tanstack/react-router'
import { useResetPassword } from '@/api/features/auth/auth.mutations'
import { useAlert } from '@/components/Alert'
import { ResetPasswordRequestSchema } from '@/api/features/auth/auth.schemas'
import { useAuthFormSubmission } from './useAuthFormSubmission'

export function useResetPasswordForm() {
  const search = useSearch({ strict: false }) as { token?: string; email?: string }
  const token = search.token || ''
  const emailParam = search.email || ''

  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const resetPasswordMutation = useResetPassword()
  const { showAlert } = useAlert()

  const { handleSubmit, isPending } = useAuthFormSubmission({
    mutation: resetPasswordMutation,
    onSuccess: {
      heading: 'Password Reset Successful',
      message: 'Your password has been reset. Please login with your new password.',
      duration: 5000,
      redirectTo: '/auth/login',
      redirectDelay: 1000,
    },
    onError: {
      heading: 'Reset Failed',
      message: 'Failed to reset password. Please try again or request a new link.',
      duration: 5000,
    },
  })

  const validatePassword = React.useCallback(() => {
    try {
      ResetPasswordRequestSchema.parse({
        email: emailParam,
        token,
        password,
        passwordConfirmation: confirmPassword,
      })
      return true
    } catch {
      return false
    }
  }, [emailParam, token, password, confirmPassword])

  const getPasswordErrors = React.useCallback(() => {
    try {
      ResetPasswordRequestSchema.parse({
        email: emailParam,
        token,
        password,
        passwordConfirmation: confirmPassword,
      })
      return []
    } catch (error) {
      if (error instanceof Error && 'errors' in error) {
        const zodError = error as { errors: Array<{ path: string[]; message: string }> }
        return zodError.errors.map(err => err.message)
      }
      return []
    }
  }, [emailParam, token, password, confirmPassword])

  const handleResetPassword = React.useCallback(async () => {
    if (!token || !emailParam) {
      showAlert({
        type: 'error',
        heading: 'Invalid Reset Link',
        message: 'Invalid reset link. Please request a new one.',
        duration: 5000
      })
      return
    }

    if (!validatePassword()) {
      const errors = getPasswordErrors()
      showAlert({
        type: 'error',
        heading: 'Validation Error',
        message: errors.join('\n') || 'Please check your password requirements.',
        duration: 5000
      })
      return
    }

    await handleSubmit({
      token,
      email: emailParam,
      password,
      passwordConfirmation: confirmPassword,
    })
  }, [token, emailParam, password, confirmPassword, validatePassword, getPasswordErrors, handleSubmit, showAlert])

  return {
    token,
    emailParam,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleResetPassword,
    isPending,
  }
}

