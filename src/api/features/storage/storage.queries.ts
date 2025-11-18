import { useQuery } from '@tanstack/react-query'
import { getAdminStorageOverview } from './storage.api'
import type { StorageOverviewSuccess } from './storage.types'
import type { AppError } from '../../core/error'
import { qk } from '../../query/keys'

export function useAdminStorageOverview() {
  return useQuery<StorageOverviewSuccess, AppError>({
    queryKey: qk.admin.storageOverview(),
    queryFn: () => getAdminStorageOverview(),
  })
}


