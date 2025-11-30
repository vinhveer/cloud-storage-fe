import { z } from 'zod'
import {
  AdminDashboardOverviewEnvelopeSchema,
  AdminDashboardOverviewSchema,
  AdminDashboardRecentUserSchema,
} from './admin-dashboard.schemas'

export type AdminDashboardRecentUser = z.infer<typeof AdminDashboardRecentUserSchema>
export type AdminDashboardOverview = z.infer<typeof AdminDashboardOverviewSchema>
export type AdminDashboardOverviewEnvelope = z.infer<typeof AdminDashboardOverviewEnvelopeSchema>

