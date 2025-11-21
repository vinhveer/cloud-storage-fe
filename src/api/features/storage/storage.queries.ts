import { useQuery } from '@tanstack/react-query'
import { getStorageBreakdown, getStorageLimit, type StorageBreakdownParams } from './storage.api'
import type { StorageBreakdown, StorageLimit } from './storage.types'
import type { AppError } from '../../core/error'

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

