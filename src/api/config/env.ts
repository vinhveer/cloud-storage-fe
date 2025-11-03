import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().min(1, 'VITE_API_BASE_URL is required'),
  VITE_API_TIMEOUT_MS: z.coerce.number().int().positive().optional(),
})

const parsedEnv = envSchema.safeParse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_API_TIMEOUT_MS: import.meta.env.VITE_API_TIMEOUT_MS,
})

if (!parsedEnv.success) {
  const formattedError = parsedEnv.error.format()
  const message = formattedError.VITE_API_BASE_URL?._errors?.[0] ?? 'Invalid environment configuration'
  throw new Error(message)
}

const requiredEnv = parsedEnv.data

export const env = {
  apiBaseUrl: requiredEnv.VITE_API_BASE_URL,
  apiTimeoutMs: requiredEnv.VITE_API_TIMEOUT_MS ?? 15000,
} as const


