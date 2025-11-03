import type { AxiosRequestConfig } from 'axios'
import { httpClient } from '../config/axios'
import { toAppError } from './error'

export async function get<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
  try {
    const response = await httpClient.get<T>(url, config)
    return response.data
  } catch (error) {
    throw toAppError(error)
  }
}

export async function post<T, B>(url: string, body: B, config: AxiosRequestConfig = {}): Promise<T> {
  try {
    const response = await httpClient.post<T>(url, body, config)
    return response.data
  } catch (error) {
    throw toAppError(error)
  }
}

export async function put<T, B>(url: string, body: B, config: AxiosRequestConfig = {}): Promise<T> {
  try {
    const response = await httpClient.put<T>(url, body, config)
    return response.data
  } catch (error) {
    throw toAppError(error)
  }
}

export async function del<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
  try {
    const response = await httpClient.delete<T>(url, config)
    return response.data
  } catch (error) {
    throw toAppError(error)
  }
}

interface UploadOptions extends AxiosRequestConfig {
  onProgress?: (progress: number) => void
}

export async function upload<T>(url: string, formData: FormData, options: UploadOptions = {}): Promise<T> {
  const { onProgress, ...config } = options

  try {
    const response = await httpClient.post<T>(url, formData, {
      ...config,
      headers: {
        ...(config.headers ?? {}),
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        if (!onProgress || !progressEvent.total) {
          return
        }
        const completed = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(completed)
      },
    })

    return response.data
  } catch (error) {
    throw toAppError(error)
  }
}


