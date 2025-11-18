import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'
import { AdminUserItemSchema } from './admin-users.schemas'

export const AdminUserCreateRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['user', 'admin']),
})

export const AdminUserCreateSuccessSchema = z.object({
  success: z.boolean().optional(),
  user: AdminUserItemSchema,
})

export const AdminUserCreateEnvelopeSchema = createApiResponseSchema(AdminUserCreateSuccessSchema)

// Accept both { user: {...} } and { success, user: {...} } and envelope with data
export const AdminUserCreateResponseSchema = z.union([
  AdminUserCreateSuccessSchema,
  AdminUserCreateEnvelopeSchema,
])


