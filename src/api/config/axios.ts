import axios, { AxiosError } from 'axios'
import { getAccessToken, clearTokens } from '../core/auth-key'
import { AppError, toAppError } from '../core/error'
import { env } from './env'

declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuth?: boolean
  }
}

const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs,
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use(config => {
  if (!config.skipAuth) {
    const accessToken = getAccessToken()
    if (accessToken) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${accessToken}`
    }
  }
  return config
})

httpClient.interceptors.response.use(
  response => response,
  async error => {
    const status = (error as AxiosError).response?.status

    if (status === 401) {
      clearTokens()
      throw new AppError('Unauthorized', { status: 401, code: 'UNAUTHORIZED' })
    }

    throw toAppError(error)
  }
)

export { httpClient }


