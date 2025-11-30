import { z } from 'zod'
import {
  UserDashboardFileTypeStatSchema,
  UserDashboardOverviewEnvelopeSchema,
  UserDashboardOverviewSchema,
  UserDashboardStatsEnvelopeSchema,
  UserDashboardStatsSchema,
  UserDashboardStorageTimelinePointSchema,
} from './user-dashboard.schemas'

export type UserDashboardOverview = z.infer<typeof UserDashboardOverviewSchema>
export type UserDashboardOverviewEnvelope = z.infer<typeof UserDashboardOverviewEnvelopeSchema>

export type UserDashboardFileTypeStat = z.infer<typeof UserDashboardFileTypeStatSchema>
export type UserDashboardStorageTimelinePoint = z.infer<typeof UserDashboardStorageTimelinePointSchema>
export type UserDashboardStats = z.infer<typeof UserDashboardStatsSchema>
export type UserDashboardStatsEnvelope = z.infer<typeof UserDashboardStatsEnvelopeSchema>

