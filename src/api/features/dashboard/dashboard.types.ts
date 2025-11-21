import { z } from 'zod'
import {
  DashboardFileTypeStatSchema,
  DashboardOverviewEnvelopeSchema,
  DashboardOverviewSchema,
  DashboardStatsEnvelopeSchema,
  DashboardStatsSchema,
  DashboardStorageTimelinePointSchema,
} from './dashboard.schemas'

export type DashboardOverview = z.infer<typeof DashboardOverviewSchema>
export type DashboardOverviewEnvelope = z.infer<typeof DashboardOverviewEnvelopeSchema>

export type DashboardFileTypeStat = z.infer<typeof DashboardFileTypeStatSchema>
export type DashboardStorageTimelinePoint = z.infer<typeof DashboardStorageTimelinePointSchema>
export type DashboardStats = z.infer<typeof DashboardStatsSchema>
export type DashboardStatsEnvelope = z.infer<typeof DashboardStatsEnvelopeSchema>


