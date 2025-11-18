import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'

export const AdminUserRoleUpdateRequestSchema = z.object({
  role: z.enum(['user', 'admin']),
})

export const UpdatedUserRoleSchema = z.object({
  user_id: z.number(),
  role: z.enum(['user', 'admin']),
})

export const AdminUserRoleUpdateSuccessSchema = z.object({
  success: z.boolean().optional(),
  message: z.string().min(1).optional(),
  user: UpdatedUserRoleSchema.optional(),
})

export const AdminUserRoleUpdateEnvelopeSchema = createApiResponseSchema(AdminUserRoleUpdateSuccessSchema)

export const AdminUserRoleUpdateResponseSchema = z.union([
  AdminUserRoleUpdateSuccessSchema,
  AdminUserRoleUpdateEnvelopeSchema,
])


