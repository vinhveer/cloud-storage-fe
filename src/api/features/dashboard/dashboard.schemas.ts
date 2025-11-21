import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'

export const DashboardOverviewSchema = z.object({
  files_count: z.number(),
  folders_count: z.number(),
  storage_used: z.number(),
  storage_limit: z.number(),
  storage_usage_percent: z.number(),
  recent_activity_count: z.number(),
})

export const DashboardOverviewEnvelopeSchema = createApiResponseSchema(DashboardOverviewSchema)

export const DashboardFileTypeStatSchema = z.object({
  extension: z.string(),
  count: z.number(),
  total_size: z.number(),
})

export const DashboardStorageTimelinePointSchema = z.object({
  date: z.string(),
  uploaded: z.number(),
})

export const DashboardStatsSchema = z.object({
  file_type_stats: z.array(DashboardFileTypeStatSchema),
  storage_timeline: z.array(DashboardStorageTimelinePointSchema),
  total_storage_used: z.number(),
  total_files: z.number(),
})

export const DashboardStatsEnvelopeSchema = createApiResponseSchema(DashboardStatsSchema)


