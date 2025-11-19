import { useQuery } from '@tanstack/react-query'
import { getAdminStorageUsers } from './storage-users.api'
import type { StorageUsersListParams, StorageUsersSuccess } from './storage-users.types'
import type { AppError } from '../../core/error'
import { qk } from '../../query/keys'
import type { ListParams } from '../../core/types'

export function useAdminStorageUsers(params: StorageUsersListParams = {}) {
  const listParams: ListParams = {
    page: params.page,
    limit: params.per_page,
    search: params.search,
  }

  return useQuery<StorageUsersSuccess, AppError>({
    queryKey: qk.admin.storageUsers(listParams),
    queryFn: () => getAdminStorageUsers(params),
  })
}


