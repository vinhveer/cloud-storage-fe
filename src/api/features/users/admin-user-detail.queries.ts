import { useQuery } from '@tanstack/react-query'
import { getAdminUserById } from './admin-user-detail.api'
import type { AdminUser } from './admin-user-detail.types'
import type { AppError } from '../../core/error'
import { qk } from '../../query/keys'

export function useAdminUserDetail(userId: number | undefined) {
  return useQuery<AdminUser, AppError>({
    queryKey: qk.admin.userById(String(userId)),
    queryFn: () => {
      if (userId === undefined) {
        throw new Error('userId is required')
      }
      return getAdminUserById(userId)
    },
    enabled: userId !== undefined,
  })
}


