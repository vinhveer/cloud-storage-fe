import { z } from 'zod'
import { AdminUserItemSchema } from './admin-users.schemas'
import { createApiResponseSchema } from '../../core/guards'

export const AdminUserWrapperSchema = z.object({
  user: AdminUserItemSchema,
})

export const AdminUserEnvelopeSchema = createApiResponseSchema(AdminUserWrapperSchema)

// Accept both plain { user: {...} } and envelope { success, data: { user: {...} } }
export const AdminUserDetailResponseSchema = z.union([AdminUserWrapperSchema, AdminUserEnvelopeSchema])


