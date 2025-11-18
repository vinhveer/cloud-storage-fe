import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'

export const AdminUserDeleteSuccessSchema = z.object({
  success: z.literal(true).optional(),
  message: z.string().min(1),
})

export const AdminUserDeleteEnvelopeSchema = createApiResponseSchema(AdminUserDeleteSuccessSchema)


