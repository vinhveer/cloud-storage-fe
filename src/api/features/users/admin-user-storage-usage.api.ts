import { get } from '../../core/fetcher'
import { AdminUserStorageUsageResponseSchema } from './admin-user-storage-usage.schemas'
import type { AdminUserStorageUsage, AdminUserStorageUsageResponse } from './admin-user-storage-usage.types'
import { z } from 'zod'
import { AppError } from '../../core/error'

export async function getAdminUserStorageUsage(userId: number): Promise<AdminUserStorageUsage> {
  const response = await get<unknown>(`/api/admin/users/${userId}/storage-usage`)
  const parsed = AdminUserStorageUsageResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw new AppError('Invalid response format', { code: 'INVALID_RESPONSE', details: parsed.error.issues })
  }
  const value: AdminUserStorageUsageResponse = parsed.data as z.infer<typeof AdminUserStorageUsageResponseSchema>
  if ('success' in value && 'data' in value) {
    return value.data
  }
  return value
}


