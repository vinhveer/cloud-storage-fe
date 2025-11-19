import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'

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


