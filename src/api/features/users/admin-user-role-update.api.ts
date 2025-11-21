import { put } from '../../core/fetcher'
import {
  AdminUserRoleUpdateRequestSchema,
  AdminUserRoleUpdateResponseSchema,
} from './admin-user-role-update.schemas'
import type {
  AdminUserRoleUpdateRequest,
  AdminUserRoleUpdateResponse,
  UpdatedUserRole,
} from './admin-user-role-update.types'
import { z } from 'zod'
import { AppError } from '../../core/error'

export async function updateAdminUserRole(userId: number, payload: AdminUserRoleUpdateRequest): Promise<UpdatedUserRole> {
  const valid = AdminUserRoleUpdateRequestSchema.parse(payload)
  const response = await put<unknown, AdminUserRoleUpdateRequest>(`/api/admin/users/${userId}/role`, valid)
  const parsed = AdminUserRoleUpdateResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw new AppError('Invalid response format', { code: 'INVALID_RESPONSE', details: parsed.error.issues })
  }
  const value: AdminUserRoleUpdateResponse = parsed.data as z.infer<typeof AdminUserRoleUpdateResponseSchema>
  if ('success' in value && 'data' in value) {
    if (!value.data.user) {
      throw new AppError('Missing user in response', { code: 'INVALID_RESPONSE' })
    }
    return value.data.user
  }
  if (!value.user) {
    throw new AppError('Missing user in response', { code: 'INVALID_RESPONSE' })
  }
  return value.user
}


