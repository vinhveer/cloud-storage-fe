import { z } from 'zod'
import { AdminUserDetailResponseSchema, AdminUserEnvelopeSchema, AdminUserWrapperSchema } from './admin-user-detail.schemas'
import { AdminUserItemSchema } from './admin-users.schemas'

export type AdminUser = z.infer<typeof AdminUserItemSchema>
export type AdminUserWrapper = z.infer<typeof AdminUserWrapperSchema>
export type AdminUserEnvelope = z.infer<typeof AdminUserEnvelopeSchema>
export type AdminUserDetailResponse = z.infer<typeof AdminUserDetailResponseSchema>


