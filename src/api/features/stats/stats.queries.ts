import { useQuery } from '@tanstack/react-query'
import { getAdminFileStats, getAdminStorageStats, getAdminUserStats } from './stats.api'
import type { FileStatsSuccess, StorageStatsParams, StorageStatsSuccess, UserStatsSuccess } from './stats.types'
import type { AppError } from '../../core/error'
import { qk } from '../../query/keys'

export function useAdminUserStats() {
  return useQuery<UserStatsSuccess, AppError>({
    queryKey: qk.admin.statsUsers(),
    queryFn: () => getAdminUserStats(),
  })
}

export function useAdminFileStats() {
  return useQuery<FileStatsSuccess, AppError>({
    queryKey: qk.admin.statsFiles(),
    queryFn: () => getAdminFileStats(),
  })
}

export function useAdminStorageStats(params: StorageStatsParams = {}) {
  return useQuery<StorageStatsSuccess, AppError>({
    queryKey: qk.admin.statsStorage(params),
    queryFn: () => getAdminStorageStats(params),
  })
}


