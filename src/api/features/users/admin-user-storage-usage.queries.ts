import { useQuery } from '@tanstack/react-query'
import { getAdminUserStorageUsage } from './admin-user-storage-usage.api'
import type { AdminUserStorageUsage } from './admin-user-storage-usage.types'
import type { AppError } from '../../core/error'
import { qk } from '../../query/keys'

export function useAdminUserStorageUsage(userId: number | undefined) {
  return useQuery<AdminUserStorageUsage, AppError>({
    queryKey: qk.admin.userStorageUsage(String(userId)),
    queryFn: () => {
      if (userId === undefined) {
        throw new Error('userId is required')
      }
      return getAdminUserStorageUsage(userId)
    },
    enabled: userId !== undefined,
  })
}


