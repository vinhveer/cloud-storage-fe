import { z } from 'zod'
import {
  AdminUserCreateEnvelopeSchema,
  AdminUserCreateRequestSchema,
  AdminUserCreateResponseSchema,
  AdminUserCreateSuccessSchema,
} from './admin-user-create.schemas'
import { AdminUserItemSchema } from './admin-users.schemas'

export type AdminUserCreateRequest = z.infer<typeof AdminUserCreateRequestSchema>
export type AdminUserCreateSuccess = z.infer<typeof AdminUserCreateSuccessSchema>
export type AdminUserCreateEnvelope = z.infer<typeof AdminUserCreateEnvelopeSchema>
export type AdminUserCreateResponse = z.infer<typeof AdminUserCreateResponseSchema>
export type AdminUserItem = z.infer<typeof AdminUserItemSchema>


