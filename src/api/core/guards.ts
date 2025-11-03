import { z } from 'zod'
import { AppError } from './error'

export function parseWithZod<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new AppError('Invalid response format', {
      code: 'INVALID_RESPONSE',
      details: result.error.format(),
    })
  }
  return result.data
}

export function createApiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    data: dataSchema,
    error: z.unknown().nullable().optional(),
    meta: z.unknown().nullable().optional(),
  })
}

export function createNullableApiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    data: dataSchema.nullable(),
    error: z.unknown().nullable().optional(),
    meta: z.unknown().nullable().optional(),
  })
}

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


