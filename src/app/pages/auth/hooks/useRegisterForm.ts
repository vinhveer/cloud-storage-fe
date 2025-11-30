import React from 'react'
import { useRegister } from '@/api/features/auth/auth.mutations'
import { useAlert } from '@/components/Alert'
import { useAuthFormSubmission } from './useAuthFormSubmission'
import { RegisterRequestSchema } from '@/api/features/auth/auth.schemas'
import { ZodError } from 'zod'

export function useRegisterForm() {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const registerMutation = useRegister()
  const { showAlert } = useAlert()

  const { handleSubmit, isPending } = useAuthFormSubmission({
    mutation: registerMutation,
    onSuccess: {
      heading: 'Registration Successful',
      message: 'Registration successful. Please check your email to verify your account.',
      duration: 3000,
      redirectTo: '/auth/verify-email',
      redirectDelay: 1000,
      onSuccess: () => {
        if (globalThis.window) {
          try {
            globalThis.window.sessionStorage.setItem('cloud-storage.lastRegisterEmail', email)
          } catch {
            // ignore storage errors
          }
        }
      },
    },
    onError: {
      heading: 'Registration Failed',
      message: 'Registration failed, please try again.',
      duration: 0,
    },
  })

  const handleRegister = React.useCallback(async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      showAlert({
        type: 'error',
        heading: 'Validation Error',
        message: 'Please fill in all required fields.',
        duration: 5000
      })
      return
    }

    try {
      RegisterRequestSchema.parse({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        passwordConfirmation: confirmPassword.trim(),
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
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      passwordConfirmation: confirmPassword.trim(),
    })
  }, [name, email, password, confirmPassword, handleSubmit, showAlert])

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleRegister,
    isPending,
  }
}

