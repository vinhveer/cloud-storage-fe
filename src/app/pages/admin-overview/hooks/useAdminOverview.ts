import { useAdminDashboardOverview } from '@/api/features/admin-dashboard/admin-dashboard.queries'
import type { AdminDashboardRecentUser } from '@/api/features/admin-dashboard/admin-dashboard.types'

export type TableRecentUser = AdminDashboardRecentUser & {
  id: number
}

export function useAdminOverview() {
  const { data, isLoading, error, refetch } = useAdminDashboardOverview()

  const tableUsers: TableRecentUser[] = data?.recent_users.map(user => ({
    ...user,
    id: user.user_id,
  })) ?? []

  return {
    data,
    isLoading,
    error,
    refetch,
    tableUsers,
  }
}

