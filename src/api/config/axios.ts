import axios, { AxiosError } from 'axios'
import { getAccessToken, clearTokens } from '../core/auth-key'
import { AppError, toAppError } from '../core/error'
import { env } from './env'

/**
 * Mở rộng AxiosRequestConfig để bổ sung thuộc tính skipAuth.
 * Thuộc tính này dùng để đánh dấu rằng request không cần gửi kèm Authorization header.
 */
declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuth?: boolean
  }
}

/**
 * Khởi tạo một Axios instance dùng chung cho toàn bộ ứng dụng.
 * Cấu hình mặc định bao gồm:
 * - API base URL
 * - Thời gian timeout
 * - Header Content-Type sử dụng JSON
 */
const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request Interceptor.
 * Chức năng:
 * - Tự động lấy access token đang lưu trữ và gắn vào Authorization header.
 * - Nếu request có đặt skipAuth là true thì interceptor sẽ không gắn token.
 * Mục đích: giúp toàn bộ API private tự động gửi token mà không cần lặp lại logic trong từng request.
 */
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

/**
 * Response Interceptor.
 * Chức năng:
 * - Kiểm tra lỗi trả về từ API.
 * - Nếu status code là 401 (Unauthorized):
 *   - Xoá token trong storage.
 *   - Ném ra AppError với trạng thái Unauthorized.
 * - Với các lỗi khác:
 *   - Chuyển dữ liệu lỗi thành AppError chuẩn hoá bằng hàm toAppError.
 * Mục đích: đảm bảo toàn bộ lỗi API trong ứng dụng có cấu trúc đồng nhất và dễ xử lý.
 */
httpClient.interceptors.response.use(
  response => response,  // Trả về phản hồi gốc khi không có lỗi

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
