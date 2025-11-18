import { z } from 'zod'
import {
  AdminUserUpdateEnvelopeSchema,
  AdminUserUpdateRequestSchema,
  AdminUserUpdateResponseSchema,
  AdminUserUpdateSuccessSchema,
} from './admin-user-update.schemas'
import { AdminUserItemSchema } from './admin-users.schemas'

export type AdminUserUpdateRequest = z.infer<typeof AdminUserUpdateRequestSchema>
export type AdminUserUpdateSuccess = z.infer<typeof AdminUserUpdateSuccessSchema>
export type AdminUserUpdateEnvelope = z.infer<typeof AdminUserUpdateEnvelopeSchema>
export type AdminUserUpdateResponse = z.infer<typeof AdminUserUpdateResponseSchema>
export type AdminUserItem = z.infer<typeof AdminUserItemSchema>


