import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'

export const RecentUserSchema = z.object({
  user_id: z.number(),
  name: z.string().min(1),
  email: z.string().min(1),
  created_at: z.string().min(1),
})

export const DashboardSuccessSchema = z.object({
  total_users: z.number(),
  total_files: z.number(),
  total_storage_used: z.number(),
  average_storage_per_user: z.number(),
  active_public_links: z.number(),
  recent_users: z.array(RecentUserSchema),
})

export const DashboardEnvelopeSchema = createApiResponseSchema(DashboardSuccessSchema)


