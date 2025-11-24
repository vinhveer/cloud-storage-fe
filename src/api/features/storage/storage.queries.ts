import { useQuery } from '@tanstack/react-query'
import {
  getStorageBreakdown,
  getStorageLimit,
  getAdminStorageUsers,
  type StorageBreakdownParams,
} from './storage.api'
import type { StorageBreakdown, StorageLimit, StorageUsersListParams, StorageUsersSuccess } from './storage.types'
import type { AppError } from '../../core/error'
import { qk } from '../../query/keys'
import type { ListParams } from '../../core/types'

export function useStorageBreakdown(params: StorageBreakdownParams) {
  return useQuery<StorageBreakdown, AppError>({
    queryKey: ['storage-breakdown', params],
    queryFn: () => getStorageBreakdown(params),
  })
}

export function useStorageLimit() {
  return useQuery<StorageLimit, AppError>({
    queryKey: ['storage-limit'],
    queryFn: () => getStorageLimit(),
  })
}

// Alias phục vụ page test admin storage overview
export const useAdminStorageOverview = useStorageLimit

// Admin storage users
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
