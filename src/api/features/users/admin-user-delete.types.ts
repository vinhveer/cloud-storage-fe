import { z } from 'zod'
import { AdminUserDeleteEnvelopeSchema, AdminUserDeleteSuccessSchema } from './admin-user-delete.schemas'

export type AdminUserDeleteSuccess = z.infer<typeof AdminUserDeleteSuccessSchema>
export type AdminUserDeleteEnvelope = z.infer<typeof AdminUserDeleteEnvelopeSchema>


