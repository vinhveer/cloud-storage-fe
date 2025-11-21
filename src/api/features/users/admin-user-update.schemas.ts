import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'
import { AdminUserItemSchema } from './admin-users.schemas'

export const AdminUserUpdateRequestSchema = z.object({
  name: z.string().min(1).optional(),
  storage_limit: z.number().int().nonnegative().optional(),
})

export const AdminUserUpdateSuccessSchema = z.object({
  success: z.boolean().optional(),
  user: AdminUserItemSchema,
})

export const AdminUserUpdateEnvelopeSchema = createApiResponseSchema(AdminUserUpdateSuccessSchema)

// Chấp nhận cả dạng trực tiếp và có envelope
export const AdminUserUpdateResponseSchema = z.union([
  AdminUserUpdateSuccessSchema,
  AdminUserUpdateEnvelopeSchema,
])


