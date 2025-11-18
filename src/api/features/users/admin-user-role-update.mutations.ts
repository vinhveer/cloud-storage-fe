import { useMutation } from '@tanstack/react-query'
import { updateAdminUserRole } from './admin-user-role-update.api'
import type { AdminUserRoleUpdateRequest, UpdatedUserRole } from './admin-user-role-update.types'
import type { AppError } from '../../core/error'

export type UpdateAdminUserRoleVariables = {
  userId: number
  role: 'user' | 'admin'
}

export function useUpdateAdminUserRole() {
  return useMutation<UpdatedUserRole, AppError, UpdateAdminUserRoleVariables>({
    mutationFn: variables => updateAdminUserRole(variables.userId, { role: variables.role } as AdminUserRoleUpdateRequest),
  })
}


