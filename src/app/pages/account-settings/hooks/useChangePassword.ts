import React from 'react'
import { useChangePassword as useChangePasswordMutation } from '@/api/features/auth/auth.mutations'
import { useAlert } from '@/components/Alert'
import { ChangePasswordRequestSchema } from '@/api/features/auth/auth.schemas'
import { ZodError } from 'zod'
import { AppError } from '@/api/core/error'

export function useChangePassword() {
  const [currentPassword, setCurrentPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const changePasswordMutation = useChangePasswordMutation()
  const { showAlert } = useAlert()

  const handleChangePassword = React.useCallback(async (): Promise<boolean> => {
    if (!currentPassword.trim()) {
      showAlert({
        type: 'error',
        heading: 'Validation Error',
        message: 'Please enter your current password.',
        duration: 5000
      })
      return false
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      showAlert({
        type: 'error',
        heading: 'Validation Error',
        message: 'Please fill in all password fields.',
        duration: 5000
      })
      return false
    }

    try {
      ChangePasswordRequestSchema.parse({
        currentPassword: currentPassword.trim(),
        password: newPassword.trim(),
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
        return false
      }
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: currentPassword.trim(),
        password: newPassword.trim(),
        passwordConfirmation: confirmPassword.trim(),
      })
      showAlert({
        type: 'success',
        heading: 'Password Changed',
        message: 'Your password has been changed successfully.',
        duration: 5000
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      return true
    } catch (unknownError) {
      const applicationError = unknownError as AppError
      let errorMessage = applicationError.message || 'Failed to change password.'

      if (applicationError.details && typeof applicationError.details === 'object') {
        const details = applicationError.details as Record<string, unknown>
        const validationMessages: string[] = []

        Object.values(details).forEach((messages) => {
          if (Array.isArray(messages)) {
            messages.forEach(msg => {
              if (typeof msg === 'string') {
                validationMessages.push(msg)
              }
            })
          } else if (typeof messages === 'string') {
            validationMessages.push(messages)
          }
        })

        if (validationMessages.length > 0) {
          errorMessage = validationMessages.join('\n')
        }
      }

      showAlert({
        type: 'error',
        heading: 'Password Change Failed',
        message: errorMessage,
        duration: 7000
      })
      return false
    }
  }, [currentPassword, newPassword, confirmPassword, changePasswordMutation, showAlert])

  const reset = React.useCallback(() => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }, [])

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleChangePassword,
    reset,
    isPending: changePasswordMutation.isPending,
  }
}

