import { useMutation } from '@tanstack/react-query'
import { updateAdminUser } from './admin-user-update.api'
import type { AdminUserItem, AdminUserUpdateRequest } from './admin-user-update.types'
import type { AppError } from '../../core/error'

export type UpdateAdminUserVariables = {
  userId: number
  name?: string
  storage_limit?: number
}

export function useUpdateAdminUser() {
  return useMutation<AdminUserItem, AppError, UpdateAdminUserVariables>({
    mutationFn: variables =>
      updateAdminUser(variables.userId, {
        name: variables.name,
        storage_limit: variables.storage_limit,
      } as AdminUserUpdateRequest),
  })
}


