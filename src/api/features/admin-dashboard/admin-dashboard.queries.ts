import { useQuery } from '@tanstack/react-query'
import { getAdminDashboardOverview } from './admin-dashboard.api'
import type { AdminDashboardOverview } from './admin-dashboard.types'
import type { AppError } from '../../core/error'
import { qk } from '../../query/keys'

export function useAdminDashboardOverview() {
  return useQuery<AdminDashboardOverview, AppError>({
    queryKey: qk.admin.dashboard(),
    queryFn: () => getAdminDashboardOverview(),
  })
}

