import { useAdminUserStats } from '@/api/features/stats/stats.queries'
import Loading from '@/components/Loading/Loading'
import { formatNumber } from '../utils'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

export default function UserStatsSection() {
  const { data, isLoading, error } = useAdminUserStats()

  if (isLoading) {
    return (
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">User Statistics</h2>
        <div className="flex items-center justify-center py-8">
          <Loading size="md" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">User Statistics</h2>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 text-sm text-red-800 dark:text-red-200">
          Error loading user stats: {error.message}
        </div>
      </section>
    )
  }

  if (!data) {
    return null
  }

  const rolesData = Object.entries(data.roles).map(([role, count]) => ({
    name: role.charAt(0).toUpperCase() + role.slice(1),
    value: count,
  }))

  const storageData = data.storage_usage_distribution.map(bucket => ({
    range: bucket.range,
    users: bucket.users,
  }))

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-100 rounded-lg shadow-lg p-3 border border-gray-700">
          <p className="text-sm font-medium mb-1">{payload[0].name}</p>
          <p className="text-sm">
            <span className="text-blue-400">Count: </span>
            <span className="font-semibold">{formatNumber(payload[0].value)}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Roles Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={rolesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(1) : '0'}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {rolesData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Storage Usage Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={storageData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis
                dataKey="range"
                angle={-45}
                textAnchor="end"
                height={80}
                className="text-xs fill-gray-600 dark:fill-gray-400"
                tick={{ fontSize: 11 }}
              />
              <YAxis
                className="text-xs fill-gray-600 dark:fill-gray-400"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => formatNumber(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="users" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Users (Last 7 Days):</span>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {formatNumber(data.new_users_last_7_days)}
          </span>
        </div>
      </div>
    </section>
  )
}
