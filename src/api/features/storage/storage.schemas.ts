import { z } from 'zod'

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


