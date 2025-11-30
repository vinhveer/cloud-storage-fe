import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'

export const AdminDashboardRecentUserSchema = z.object({
  user_id: z.number(),
  name: z.string(),
  email: z.string(),
  created_at: z.string(),
})

export const AdminDashboardOverviewSchema = z.object({
  total_users: z.number(),
  total_files: z.number(),
  total_storage_used: z.number(),
  average_storage_per_user: z.number(),
  active_public_links: z.number(),
  recent_users: z.array(AdminDashboardRecentUserSchema),
})

export const AdminDashboardOverviewEnvelopeSchema = createApiResponseSchema(AdminDashboardOverviewSchema)

