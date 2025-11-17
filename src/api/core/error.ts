import { isAxiosError } from 'axios'

export interface AppErrorParams {
  status?: number
  code?: string
  details?: unknown
}

/**
 * Lớp AppError: đại diện cho lỗi đã được chuẩn hóa.
 * Bổ sung status, code, details để xử lý lỗi có cấu trúc.
 */
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

/**
 * ErrorLike mô tả các dạng lỗi mà backend có thể trả về.
 * Dùng để phân tích dữ liệu response không đồng nhất.
 */
type ErrorLike = {
  message?: string
  error?: { message?: string; code?: string; errors?: unknown }
  data?: { message?: string }
  errors?: Record<string, unknown>
}

/**
 * Hàm toAppError:
 * Chuẩn hóa mọi loại lỗi (AxiosError, Error thông thường hoặc dữ liệu lạ)
 * Trả về AppError với đầy đủ thông tin để xử lý nhất quán trong toàn ứng dụng.
 */
export function toAppError(error: unknown): AppError {
  // Trường hợp lỗi đã là AppError
  if (error instanceof AppError) {
    return error
  }

  // Trường hợp lỗi đến từ Axios
  if (isAxiosError(error)) {
    const status = error.response?.status
    const responseData = error.response?.data as ErrorLike | undefined

    // Ưu tiên mã lỗi từ backend (responseData.error.code) hơn mã lỗi của Axios
    const code = responseData?.error?.code ?? error.code
    const fallbackMessage = error.message || 'Request failed'

    // Lấy message theo thứ tự ưu tiên hợp lý
    const message =
      responseData?.message ??
      responseData?.error?.message ??
      responseData?.data?.message ??
      fallbackMessage

    return new AppError(message, {
      status,
      code,
      // Lấy phần chi tiết lỗi từ nhiều trường khác nhau
      details:
        responseData?.error?.errors ??
        responseData?.errors ??
        responseData ??
        error.toJSON?.() ??
        error,
    })
  }

  // Trường hợp lỗi là Error chuẩn của JavaScript
  if (error instanceof Error) {
    return new AppError(error.message, { details: error })
  }

  // Trường hợp không xác định loại lỗi
  return new AppError('Unknown error', { details: error })
}
