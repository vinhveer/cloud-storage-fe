import { useQuery } from '@tanstack/react-query'
import { getUserDashboardOverview, getUserDashboardStats, type UserDashboardStatsParams } from './user-dashboard.api'
import type { UserDashboardOverview, UserDashboardStats } from './user-dashboard.types'
import type { AppError } from '../../core/error'
import { qk } from '../../query/keys'

export function useUserDashboardOverview() {
  return useQuery<UserDashboardOverview, AppError>({
    queryKey: qk.userDashboard.overview(),
    queryFn: () => getUserDashboardOverview(),
  })
}

export function useUserDashboardStats(params: UserDashboardStatsParams = {}) {
  return useQuery<UserDashboardStats, AppError>({
    queryKey: qk.userDashboard.stats(params),
    queryFn: () => getUserDashboardStats(params),
  })
}

