import { post } from '../../core/fetcher'
import { AdminUserCreateRequestSchema, AdminUserCreateResponseSchema } from './admin-user-create.schemas'
import type { AdminUserCreateRequest, AdminUserCreateResponse, AdminUserItem } from './admin-user-create.types'
import { z } from 'zod'
import { AppError } from '../../core/error'

export async function createAdminUser(payload: AdminUserCreateRequest): Promise<AdminUserItem> {
  const valid = AdminUserCreateRequestSchema.parse(payload)
  const response = await post<unknown, AdminUserCreateRequest>('/api/admin/users', valid)
  const parsed = AdminUserCreateResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw new AppError('Invalid response format', { code: 'INVALID_RESPONSE', details: parsed.error.issues })
  }
  const value: AdminUserCreateResponse = parsed.data as z.infer<typeof AdminUserCreateResponseSchema>
  if ('success' in value && 'data' in value) {
    return value.data.user
  }
  return value.user
}


