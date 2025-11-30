import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'

export const UserDashboardOverviewSchema = z.object({
  files_count: z.number(),
  folders_count: z.number(),
  storage_used: z.number(),
  storage_limit: z.number(),
  storage_usage_percent: z.number(),
  recent_activity_count: z.number(),
})

export const UserDashboardOverviewEnvelopeSchema = createApiResponseSchema(UserDashboardOverviewSchema)

export const UserDashboardFileTypeStatSchema = z.object({
  extension: z.string(),
  count: z.number(),
  total_size: z.number(),
})

export const UserDashboardStorageTimelinePointSchema = z.object({
  date: z.string(),
  uploaded: z.number(),
})

export const UserDashboardStatsSchema = z.object({
  file_type_stats: z.array(UserDashboardFileTypeStatSchema),
  storage_timeline: z.array(UserDashboardStorageTimelinePointSchema),
  total_storage_used: z.number(),
  total_files: z.number(),
})

export const UserDashboardStatsEnvelopeSchema = createApiResponseSchema(UserDashboardStatsSchema)

