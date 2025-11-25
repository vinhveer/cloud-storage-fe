import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'

export const StorageBreakdownItemSchema = z.object({
  type: z.string(),
  total_size: z.number(),
  count: z.number(),
})

export const StorageBreakdownSchema = z.object({
  success: z.literal(true),
  user_id: z.number(),
  breakdown: z.array(StorageBreakdownItemSchema),
  total_size: z.number(),
})

export const StorageLimitSchema = z.object({
  success: z.literal(true),
  user_id: z.number(),
  storage_limit: z.number(),
  storage_used: z.number(),
  remaining: z.number(),
  formatted: z.object({
    limit: z.string(),
    used: z.string(),
    remaining: z.string(),
  }),
})

// Admin storage users
export const StorageUserItemSchema = z.object({
  user_id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  storage_limit: z.number(),
  storage_used: z.number(),
  usage_percent: z.number(),
})

export const StorageUsersPaginationSchema = z.object({
  current_page: z.number(),
  total_pages: z.number(),
  total_items: z.number(),
})

export const StorageUsersSuccessSchema = z.object({
  data: z.array(StorageUserItemSchema),
  pagination: StorageUsersPaginationSchema,
})

export const StorageUsersEnvelopeSchema = createApiResponseSchema(StorageUsersSuccessSchema)
