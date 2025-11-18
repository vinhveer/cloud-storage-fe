import { put } from '../../core/fetcher'
import { AdminUserUpdateRequestSchema, AdminUserUpdateResponseSchema } from './admin-user-update.schemas'
import type { AdminUserItem, AdminUserUpdateRequest, AdminUserUpdateResponse } from './admin-user-update.types'
import { z } from 'zod'
import { AppError } from '../../core/error'

export async function updateAdminUser(userId: number, payload: AdminUserUpdateRequest): Promise<AdminUserItem> {
  const valid = AdminUserUpdateRequestSchema.parse(payload)
  const response = await put<unknown, AdminUserUpdateRequest>(`/api/admin/users/${userId}`, valid)
  const parsed = AdminUserUpdateResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw new AppError('Invalid response format', { code: 'INVALID_RESPONSE', details: parsed.error.issues })
  }
  const value: AdminUserUpdateResponse = parsed.data as z.infer<typeof AdminUserUpdateResponseSchema>
  if ('success' in value && 'data' in value) {
    return value.data.user
  }
  return value.user
}


