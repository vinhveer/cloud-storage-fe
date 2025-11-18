import { get } from '../../core/fetcher'
import { AdminUsersResponseSchema } from './admin-users.schemas'
import type { AdminUsersListParams, AdminUsersResponse, AdminUsersSuccess } from './admin-users.types'
import { z } from 'zod'
import { AppError } from '../../core/error'

export async function getAdminUsers(params: AdminUsersListParams = {}): Promise<AdminUsersSuccess> {
  const response = await get<unknown>('/api/admin/users', {
    params: {
      search: params.search,
      page: params.page,
      per_page: params.per_page,
    },
  })
  const parsed = AdminUsersResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw new AppError('Invalid response format', { code: 'INVALID_RESPONSE', details: parsed.error.issues })
  }
  const value: AdminUsersResponse = parsed.data as z.infer<typeof AdminUsersResponseSchema>
  if ('success' in value && 'data' in value) {
    return value.data
  }
  return value as AdminUsersSuccess
}


