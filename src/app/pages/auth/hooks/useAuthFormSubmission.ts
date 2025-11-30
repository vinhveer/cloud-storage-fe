import React from 'react'
import { type UseMutationResult } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { AppError } from '@/api/core/error'
import { useAlert } from '@/components/Alert'

type SuccessConfig = {
  message?: string
  heading?: string
  duration?: number
  onSuccess?: () => void
  redirectTo?: string
  redirectDelay?: number
}

type ErrorConfig = {
  heading?: string
  message?: string
  duration?: number
  onError?: (error: AppError) => void
}

type UseAuthFormSubmissionOptions<TData, TVariables> = {
  mutation: UseMutationResult<TData, AppError, TVariables>
  onSuccess?: SuccessConfig
  onError?: ErrorConfig
}

export function useAuthFormSubmission<TData, TVariables>({
  mutation,
  onSuccess,
  onError,
}: UseAuthFormSubmissionOptions<TData, TVariables>) {
  const { showAlert } = useAlert()
  const navigate = useNavigate()

  const handleSubmit = React.useCallback(async (variables: TVariables) => {
    if (mutation.isPending) {
      return
    }

    try {
      const response = await mutation.mutateAsync(variables)

      const successMessage = onSuccess?.message || (response as { message?: string })?.message
      const successHeading = onSuccess?.heading

      if (successMessage || successHeading) {
        showAlert({
          type: 'success',
          heading: successHeading || 'Success',
          message: successMessage || 'Operation completed successfully',
          duration: onSuccess?.duration ?? 5000,
        })
      }

      if (onSuccess?.onSuccess) {
        onSuccess.onSuccess()
      }

      if (onSuccess?.redirectTo) {
        const delay = onSuccess.redirectDelay ?? 1000
        setTimeout(() => {
          navigate({ to: onSuccess.redirectTo! })
        }, delay)
      }

      return response
    } catch (unknownError) {
      const applicationError = unknownError as AppError

      let errorMessage = onError?.message || applicationError.message
      const errorHeading = onError?.heading

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
        heading: errorHeading || 'Error',
        message: errorMessage || 'Operation failed. Please try again.',
        icon: false,
        duration: onError?.duration ?? 0,
      })

      if (onError?.onError) {
        onError.onError(applicationError)
      }

      throw applicationError
    }
  }, [mutation, onSuccess, onError, showAlert, navigate])

  return {
    handleSubmit,
    isPending: mutation.isPending,
  }
}

