import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useLogin } from '@/api/features/auth/auth.mutations'
import { AppError } from '@/api/core/error'
import { useAuthFormSubmission } from './useAuthFormSubmission'
import { LoginRequestSchema } from '@/api/features/auth/auth.schemas'
import { ZodError } from 'zod'
import { useAlert } from '@/components/Alert'

export function useLoginForm() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showForgotPassword, setShowForgotPassword] = React.useState(false)
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const { showAlert } = useAlert()

  const deviceName = 'web-client'

  const { handleSubmit, isPending } = useAuthFormSubmission({
    mutation: loginMutation,
    onSuccess: {
      onSuccess: () => {
        navigate({ to: '/app' })
      },
    },
    onError: {
      heading: 'Login Failed',
      message: 'Login failed, please try again.',
      duration: 0,
      onError: (error: AppError) => {
        if (error.code === 'EMAIL_NOT_VERIFIED') {
          if (globalThis.window) {
            try {
              globalThis.window.sessionStorage.setItem('cloud-storage.lastLoginEmail', email)
            } catch {
              // ignore storage errors
            }
          }
          navigate({
            to: '/auth/verify-email',
          })
        } else {
          setShowForgotPassword(true)
        }
      },
    },
  })

  const handleLogin = React.useCallback(async () => {
    if (!email.trim() || !password.trim()) {
      showAlert({
        type: 'error',
        heading: 'Validation Error',
        message: 'Please fill in all required fields.',
        duration: 5000
      })
      return
    }

    try {
      LoginRequestSchema.parse({
        email: email.trim(),
        password: password.trim(),
        deviceName,
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

    await handleSubmit({
      email: email.trim(),
      password: password.trim(),
      deviceName,
    })
  }, [email, password, handleSubmit, showAlert])

  return {
    email,
    setEmail,
    password,
    setPassword,
    showForgotPassword,
    handleLogin,
    isPending,
  }
}

