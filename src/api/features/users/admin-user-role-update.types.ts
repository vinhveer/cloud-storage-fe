import { z } from 'zod'
import {
  AdminUserRoleUpdateEnvelopeSchema,
  AdminUserRoleUpdateRequestSchema,
  AdminUserRoleUpdateResponseSchema,
  AdminUserRoleUpdateSuccessSchema,
  UpdatedUserRoleSchema,
} from './admin-user-role-update.schemas'

export type AdminUserRoleUpdateRequest = z.infer<typeof AdminUserRoleUpdateRequestSchema>
export type UpdatedUserRole = z.infer<typeof UpdatedUserRoleSchema>
export type AdminUserRoleUpdateSuccess = z.infer<typeof AdminUserRoleUpdateSuccessSchema>
export type AdminUserRoleUpdateEnvelope = z.infer<typeof AdminUserRoleUpdateEnvelopeSchema>
export type AdminUserRoleUpdateResponse = z.infer<typeof AdminUserRoleUpdateResponseSchema>


