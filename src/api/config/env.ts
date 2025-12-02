import { z } from 'zod'

// Schema định nghĩa các biến môi trường bắt buộc
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().min(1, 'VITE_API_BASE_URL is required'),
  VITE_API_TIMEOUT_MS: z.coerce.number().int().positive().optional(),
  VITE_APP_URL: z.string().url().optional(),
})

// Parse và validate biến môi trường của Vite
const parsedEnv = envSchema.safeParse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_API_TIMEOUT_MS: import.meta.env.VITE_API_TIMEOUT_MS,
  VITE_APP_URL: import.meta.env.VITE_APP_URL,
})

// Nếu parse thất bại, lấy lỗi từ flatten() và ném Error
if (!parsedEnv.success) {
  let message = 'Invalid environment configuration'
  const issuesUnknown: unknown = (parsedEnv.error as unknown as { issues?: unknown }).issues
  if (Array.isArray(issuesUnknown)) {
    for (const it of issuesUnknown) {
      const item = it as { path?: unknown; message?: unknown }
      if (Array.isArray(item.path) && item.path[0] === 'VITE_API_BASE_URL' && typeof item.message === 'string') {
        message = item.message
        break
      }
    }
  }
  throw new Error(message)
}

// Toàn bộ biến môi trường hợp lệ
const requiredEnv = parsedEnv.data

// Biến môi trường chuẩn hoá dùng trong toàn app
export const env = {
  apiBaseUrl: requiredEnv.VITE_API_BASE_URL,
  apiTimeoutMs: requiredEnv.VITE_API_TIMEOUT_MS ?? 15000,
  appUrl: requiredEnv.VITE_APP_URL ?? window.location.origin,
} as const
