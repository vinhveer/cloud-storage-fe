import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'

export const RolesSchema = z.record(z.number())

export const StorageUsageBucketSchema = z.object({
  range: z.string().min(1),
  users: z.number(),
})

export const UserStatsSuccessSchema = z.object({
  roles: RolesSchema,
  storage_usage_distribution: z.array(StorageUsageBucketSchema),
  new_users_last_7_days: z.number(),
})

export const UserStatsEnvelopeSchema = createApiResponseSchema(UserStatsSuccessSchema)

export const FileExtensionStatSchema = z.object({
  extension: z.string().min(1),
  count: z.number(),
})

export const FileStatsSuccessSchema = z.object({
  file_extension_stats: z.array(FileExtensionStatSchema),
  deleted_files: z.number(),
  total_storage_used: z.number(),
})

export const FileStatsEnvelopeSchema = createApiResponseSchema(FileStatsSuccessSchema)

export const StorageTimelinePointSchema = z.object({
  date: z.string().min(1),
  total_storage_used: z.number(),
})

export const StorageStatsSuccessSchema = z.object({
  storage_timeline: z.array(StorageTimelinePointSchema),
  average_growth_per_day: z.number(),
})

export const StorageStatsEnvelopeSchema = createApiResponseSchema(StorageStatsSuccessSchema)


