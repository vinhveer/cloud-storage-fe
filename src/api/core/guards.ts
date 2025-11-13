import { z } from 'zod'
import { AppError } from './error'

/**
 * Dùng schema của Zod để validate dữ liệu.
 * Nếu dữ liệu không đúng định dạng, ném AppError với chi tiết lỗi (issues).
 */
export function parseWithZod<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data)

  if (!result.success) {
    throw new AppError('Invalid response format', {
      code: 'INVALID_RESPONSE',
      details: result.error.issues, // danh sách lỗi ZodIssue
    })
  }

  return result.data
}

/**
 * Tạo schema chuẩn cho API response dạng:
 * {
 *   success: boolean,
 *   data: ...,
 *   error?: any,
 *   meta?: any
 * }
 */
export function createApiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    data: dataSchema,
    error: z.unknown().nullable().optional(),
    meta: z.unknown().nullable().optional(),
  })
}

/**
 * Giống createApiResponseSchema nhưng cho phép
 * trường data có thể là null.
 */
export function createNullableApiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    data: dataSchema.nullable(),
    error: z.unknown().nullable().optional(),
    meta: z.unknown().nullable().optional(),
  })
}

/**
 * zodPreprocessDate:
 * Chuyển string hoặc number thành Date trước khi validate.
 * Nếu không convert được thì trả về giá trị gốc
 * và Zod sẽ báo lỗi ở bước z.date().
 */
export function zodPreprocessDate() {
  return z.preprocess(value => {
    if (value instanceof Date) {
      return value
    }

    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value)
      if (!Number.isNaN(date.getTime())) {
        return date
      }
    }

    return value
  }, z.date())
}
