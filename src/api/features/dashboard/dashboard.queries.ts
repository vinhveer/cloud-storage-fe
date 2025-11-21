import { useQuery } from '@tanstack/react-query'
import { getDashboardOverview, getDashboardStats, type DashboardStatsParams } from './dashboard.api'
import type { DashboardOverview, DashboardStats } from './dashboard.types'
import type { AppError } from '../../core/error'

export function useDashboardOverview() {
  return useQuery<DashboardOverview, AppError>({
    queryKey: ['dashboard', 'overview'],
    queryFn: () => getDashboardOverview(),
  })
}

export function useDashboardStats(params: DashboardStatsParams = {}) {
  return useQuery<DashboardStats, AppError>({
    queryKey: ['dashboard', 'stats', params],
    queryFn: () => getDashboardStats(params),
  })
}

export const useAdminDashboard = useDashboardOverview

