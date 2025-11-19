import { get } from '../../core/fetcher'
import { AdminUserDetailResponseSchema } from './admin-user-detail.schemas'
import type { AdminUser, AdminUserDetailResponse } from './admin-user-detail.types'
import { z } from 'zod'
import { AppError } from '../../core/error'

export async function getAdminUserById(userId: number): Promise<AdminUser> {
  const response = await get<unknown>(`/api/admin/users/${userId}`)
  const parsed = AdminUserDetailResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw new AppError('Invalid response format', { code: 'INVALID_RESPONSE', details: parsed.error.issues })
  }
  const value: AdminUserDetailResponse = parsed.data as z.infer<typeof AdminUserDetailResponseSchema>
  if ('success' in value && 'data' in value) {
    return value.data.user
  }
  return value.user
}


