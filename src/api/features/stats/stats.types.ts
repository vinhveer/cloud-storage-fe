import { z } from 'zod'
import {
  UserStatsEnvelopeSchema,
  UserStatsSuccessSchema,
  RolesSchema,
  StorageUsageBucketSchema,
  FileExtensionStatSchema,
  FileStatsEnvelopeSchema,
  FileStatsSuccessSchema,
  StorageTimelinePointSchema,
  StorageStatsEnvelopeSchema,
  StorageStatsSuccessSchema,
} from './stats.schemas'

export type Roles = z.infer<typeof RolesSchema>
export type StorageUsageBucket = z.infer<typeof StorageUsageBucketSchema>
export type UserStatsSuccess = z.infer<typeof UserStatsSuccessSchema>
export type UserStatsEnvelope = z.infer<typeof UserStatsEnvelopeSchema>
export type FileExtensionStat = z.infer<typeof FileExtensionStatSchema>
export type FileStatsSuccess = z.infer<typeof FileStatsSuccessSchema>
export type FileStatsEnvelope = z.infer<typeof FileStatsEnvelopeSchema>
export type StorageTimelinePoint = z.infer<typeof StorageTimelinePointSchema>
export type StorageStatsSuccess = z.infer<typeof StorageStatsSuccessSchema>
export type StorageStatsEnvelope = z.infer<typeof StorageStatsEnvelopeSchema>

export type StorageStatsParams = {
  start_date?: string
  end_date?: string
}


