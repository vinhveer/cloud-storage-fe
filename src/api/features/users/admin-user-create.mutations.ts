import { useMutation } from '@tanstack/react-query'
import { createAdminUser } from './admin-user-create.api'
import type { AdminUserCreateRequest, AdminUserItem } from './admin-user-create.types'
import type { AppError } from '../../core/error'

export function useCreateAdminUser() {
  return useMutation<AdminUserItem, AppError, AdminUserCreateRequest>({
    mutationFn: payload => createAdminUser(payload),
  })
}


