import { z } from 'zod'
import { DashboardEnvelopeSchema, DashboardSuccessSchema, RecentUserSchema } from './dashboard.schemas'

export type RecentUser = z.infer<typeof RecentUserSchema>
export type DashboardSuccess = z.infer<typeof DashboardSuccessSchema>
export type DashboardEnvelope = z.infer<typeof DashboardEnvelopeSchema>


