import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'

export const StorageOverviewFormattedSchema = z.object({
  used: z.string().min(1),
  limit: z.string().min(1),
})

export const SystemOverviewSchema = z.object({
  total_users: z.number(),
  total_files: z.number(),
  total_storage_used: z.number(),
  total_storage_limit: z.number(),
  formatted: StorageOverviewFormattedSchema,
})

export const StorageOverviewSuccessSchema = z.object({
  system_overview: SystemOverviewSchema,
})

export const StorageOverviewEnvelopeSchema = createApiResponseSchema(StorageOverviewSuccessSchema)


