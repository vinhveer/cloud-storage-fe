import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'

export const AdminUserItemSchema = z.object({
  user_id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  storage_limit: z.number(),
  storage_used: z.number(),
})

export const AdminUsersPaginationSchema = z.object({
  current_page: z.number(),
  total_pages: z.number(),
  total_items: z.number(),
})

export const AdminUsersSuccessSchema = z.object({
  data: z.array(AdminUserItemSchema),
  pagination: AdminUsersPaginationSchema,
})

export const AdminUsersEnvelopeSchema = createApiResponseSchema(AdminUsersSuccessSchema)

// Some responses may omit the success envelope. Accept both.
export const AdminUsersResponseSchema = z.union([AdminUsersEnvelopeSchema, AdminUsersSuccessSchema])


