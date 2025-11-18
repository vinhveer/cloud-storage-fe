import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'

export const AdminUserStorageUsageSchema = z.object({
  user_id: z.number(),
  storage_used: z.number(),
  storage_limit: z.number(),
  usage_percent: z.number(),
})

export const AdminUserStorageUsageEnvelopeSchema = createApiResponseSchema(AdminUserStorageUsageSchema)

// Accept both plain object and envelope data
export const AdminUserStorageUsageResponseSchema = z.union([
  AdminUserStorageUsageSchema,
  AdminUserStorageUsageEnvelopeSchema,
])


