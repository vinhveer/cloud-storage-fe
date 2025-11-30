import React from 'react'
import { useUpdateProfile as useUpdateProfileMutation } from '@/api/features/auth/auth.mutations'
import { useAlert } from '@/components/Alert'
import { UpdateProfileRequestSchema } from '@/api/features/auth/auth.schemas'
import { ZodError } from 'zod'
import { AppError } from '@/api/core/error'

type UseUpdateProfileOptions = {
  currentEmail: string
}

export function useUpdateProfile({ currentEmail }: UseUpdateProfileOptions) {
  const [name, setName] = React.useState('')
  const updateProfileMutation = useUpdateProfileMutation()
  const { showAlert } = useAlert()

  const handleUpdate = React.useCallback(async () => {
    if (!name.trim()) {
      showAlert({
        type: 'error',
        heading: 'Validation Error',
        message: 'Name cannot be empty.',
        duration: 5000
      })
      return false
    }

    try {
      UpdateProfileRequestSchema.parse({
        name: name.trim(),
        email: currentEmail,
      })
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues
          .filter(issue => issue.path.includes('name'))
          .map(issue => issue.message)
          .join('\n')
        if (errorMessages) {
          showAlert({
            type: 'error',
            heading: 'Validation Error',
            message: errorMessages,
            duration: 5000
          })
          return false
        }
      }
    }

    try {
      await updateProfileMutation.mutateAsync({
        name: name.trim(),
        email: currentEmail,
      })
      showAlert({
        type: 'success',
        heading: 'Profile Updated',
        message: 'Your name has been updated successfully.',
        duration: 5000
      })
      return true
    } catch (unknownError) {
      const applicationError = unknownError as AppError
      let errorMessage = applicationError.message || 'Failed to update profile.'

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
        heading: 'Update Failed',
        message: errorMessage,
        duration: 7000
      })
      return false
    }
  }, [name, currentEmail, updateProfileMutation, showAlert])

  return {
    name,
    setName,
    handleUpdate,
    isPending: updateProfileMutation.isPending,
  }
}

