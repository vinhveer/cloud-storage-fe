import { useQuery } from '@tanstack/react-query'
import { getAdminUsers } from './admin-users.api'
import type { AdminUsersListParams, AdminUsersSuccess } from './admin-users.types'
import type { AppError } from '../../core/error'
import { qk } from '../../query/keys'
import type { ListParams } from '../../core/types'

export function useAdminUsers(params: AdminUsersListParams = {}) {
  const listParams: ListParams = {
    page: params.page,
    limit: params.per_page,
    search: params.search,
  }

  return useQuery<AdminUsersSuccess, AppError>({
    queryKey: qk.admin.users(listParams),
    queryFn: () => getAdminUsers(params),
  })
}


