import { isAxiosError } from 'axios'

export interface AppErrorParams {
  status?: number
  code?: string
  details?: unknown
}

export class AppError extends Error {
  status?: number
  code?: string
  details?: unknown

  constructor(message: string, params: AppErrorParams = {}) {
    super(message)
    this.name = 'AppError'
    this.status = params.status
    this.code = params.code
    this.details = params.details
  }
}

type ErrorLike = {
  message?: string
  error?: { message?: string; code?: string; errors?: unknown }
  data?: { message?: string }
  errors?: Record<string, unknown>
}

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (isAxiosError(error)) {
    const status = error.response?.status
    const responseData = error.response?.data as ErrorLike | undefined
    const code = error.code ?? responseData?.error?.code
    const fallbackMessage = error.message || 'Request failed'
    const message = responseData?.message
      ?? responseData?.error?.message
      ?? responseData?.data?.message
      ?? fallbackMessage
    return new AppError(message, {
      status,
      code,
      details: responseData?.error?.errors ?? responseData?.errors ?? responseData ?? error.toJSON?.() ?? error,
    })
  }

  if (error instanceof Error) {
    return new AppError(error.message, { details: error })
  }

  return new AppError('Unknown error', { details: error })
}


