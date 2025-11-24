import type { AxiosRequestConfig } from 'axios'
import { httpClient } from '../config/axios'
import { toAppError } from './error'

type HttpRequestConfig = AxiosRequestConfig

/**
 * Gửi HTTP GET và trả về dữ liệu đã được gõ kiểu.
 */
export async function get<ResponseData>(
  requestUrl: string,
  requestConfig: HttpRequestConfig = {},
): Promise<ResponseData> {
  try {
    const response = await httpClient.get<ResponseData>(requestUrl, requestConfig)
    return response.data
  } catch (error) {
    throw toAppError(error)
  }
}

/**
 * Gửi HTTP POST với request body và trả về dữ liệu đã được gõ kiểu.
 */
export async function post<ResponseData, RequestBody>(
  requestUrl: string,
  requestBody: RequestBody,
  requestConfig: HttpRequestConfig = {},
): Promise<ResponseData> {
  try {
    const response = await httpClient.post<ResponseData>(requestUrl, requestBody, requestConfig)
    return response.data
  } catch (error) {
    throw toAppError(error)
  }
}

/**
 * Gửi HTTP PUT với request body và trả về dữ liệu đã được gõ kiểu.
 */
export async function put<ResponseData, RequestBody>(
  requestUrl: string,
  requestBody: RequestBody,
  requestConfig: HttpRequestConfig = {},
): Promise<ResponseData> {
  try {
    const response = await httpClient.put<ResponseData>(requestUrl, requestBody, requestConfig)
    return response.data
  } catch (error) {
    throw toAppError(error)
  }
}

/**
 * Gửi HTTP PATCH với request body và trả về dữ liệu đã được gõ kiểu.
 */
export async function patch<ResponseData, RequestBody>(
  requestUrl: string,
  requestBody: RequestBody,
  requestConfig: HttpRequestConfig = {},
): Promise<ResponseData> {
  try {
    const response = await httpClient.patch<ResponseData>(requestUrl, requestBody, requestConfig)
    return response.data
  } catch (error) {
    throw toAppError(error)
  }
}

/**
 * Gửi HTTP DELETE và trả về dữ liệu đã được gõ kiểu.
 */
export async function deleteRequest<ResponseData>(
  requestUrl: string,
  requestConfig: HttpRequestConfig = {},
): Promise<ResponseData> {
  try {
    const response = await httpClient.delete<ResponseData>(requestUrl, requestConfig)
    return response.data
  } catch (error) {
    throw toAppError(error)
  }
}

/**
 * Tuỳ chọn upload, cho phép truyền config Axios và callback tiến độ.
 */
interface UploadRequestOptions extends AxiosRequestConfig {
  onProgress?: (completedPercent: number) => void
}

/**
 * Upload dữ liệu dạng FormData (multipart/form-data) và theo dõi tiến độ.
 */
export async function upload<ResponseData>(
  uploadUrl: string,
  formData: FormData,
  uploadOptions: UploadRequestOptions = {},
): Promise<ResponseData> {
  const { onProgress: onProgressCallback, ...axiosConfig } = uploadOptions

  try {
    const response = await httpClient.post<ResponseData>(uploadUrl, formData, {
      ...axiosConfig,
      headers: axiosConfig.headers
        ? { ...axiosConfig.headers, 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'multipart/form-data' },
      // Gọi callback khi có tiến độ upload (tính theo phần trăm)
      onUploadProgress: progressEvent => {
        if (!onProgressCallback || !progressEvent.total) {
          return
        }
        const completedPercent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        )
        onProgressCallback(completedPercent)
      },
    })

    return response.data
  } catch (error) {
    throw toAppError(error)
  }
}
