import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'

// Backend success 200 shape: { success: true, message: string }
export const AdminUserDeleteRawSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string().min(1),
})

// Envelope success (legacy or alternate): { success:boolean, data:{ success:true, message }, error?, meta? }
export const AdminUserDeleteEnvelopeSuccessSchema = createApiResponseSchema(AdminUserDeleteRawSuccessSchema)

// Union: accept both raw and envelope success shapes.
export const AdminUserDeleteResponseSchema = z.union([
  AdminUserDeleteEnvelopeSuccessSchema,
  AdminUserDeleteRawSuccessSchema,
])

// Export a unified Success type (raw normalized)
export const AdminUserDeleteSuccessSchema = AdminUserDeleteRawSuccessSchema


