import { useAdminOverview } from './hooks/useAdminOverview'
import MetricsCards from './components/MetricsCards'
import RecentUsersTable from './components/RecentUsersTable'
import Loading from '@/components/Loading/Loading'

export default function AdminOverviewPage() {
  const { data, isLoading, error, refetch, tableUsers } = useAdminOverview()

  if (isLoading) {
    return (
      <div className="space-y-6 mb-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
            Overview
          </h1>
        </header>
        <div className="flex items-center justify-center py-12">
          <Loading size="lg" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 mb-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
            Overview
          </h1>
        </header>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-sm text-red-800 dark:text-red-200">
            Error loading data: {error.message}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="space-y-6 mb-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
          Overview
        </h1>
      </header>

      <MetricsCards data={data} />

      <section className="space-y-4 pb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Recent Users
        </h2>
        <RecentUsersTable users={tableUsers} />
      </section>
    </div>
  )
}

