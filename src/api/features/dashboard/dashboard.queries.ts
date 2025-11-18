import { useQuery } from '@tanstack/react-query'
import { getAdminDashboard } from './dashboard.api'
import type { DashboardSuccess } from './dashboard.types'
import type { AppError } from '../../core/error'
import { qk } from '../../query/keys'

export function useAdminDashboard() {
  return useQuery<DashboardSuccess, AppError>({
    queryKey: qk.admin.dashboard(),
    queryFn: () => getAdminDashboard(),
  })
}


