import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteAdminUser } from './admin-user-delete.api'
import type { AdminUserDeleteSuccess } from './admin-user-delete.types'
import type { AppError } from '../../core/error'
import { qk } from '../../query/keys'

export function useDeleteAdminUser() {
  const queryClient = useQueryClient()
  return useMutation<AdminUserDeleteSuccess, AppError, number>({
    mutationFn: userId => deleteAdminUser(userId),
    onSuccess: (_data, userId) => {
      queryClient.removeQueries({ queryKey: qk.admin.userById(String(userId)) })
      // optionally refetch the users list
      // queryClient.invalidateQueries({ queryKey: qk.admin.users() })
    },
  })
}


