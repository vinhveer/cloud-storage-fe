import { useAdminFileStats } from '@/api/features/stats/stats.queries'
import Loading from '@/components/Loading/Loading'
import { formatBytes, formatNumber } from '../utils'
import FileExtensionChart from './FileExtensionChart'

export default function FileStatsSection() {
  const { data, isLoading, error } = useAdminFileStats()

  if (isLoading) {
    return (
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">File Statistics</h2>
        <div className="flex items-center justify-center py-8">
          <Loading size="md" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">File Statistics</h2>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 text-sm text-red-800 dark:text-red-200">
          Error loading file stats: {error.message}
        </div>
      </section>
    )
  }

  if (!data) {
    return null
  }

  const totalFiles = data.file_extension_stats.reduce((sum, stat) => sum + stat.count, 0)
  const maxCount = Math.max(...data.file_extension_stats.map(s => s.count), 1)
  const sortedStats = [...data.file_extension_stats].sort((a, b) => b.count - a.count)

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">File Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Total Storage Used</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{formatBytes(data.total_storage_used)}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
          <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Deleted Files</p>
          <p className="text-2xl font-bold text-red-900 dark:text-red-100">{formatNumber(data.deleted_files)}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Total Files</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">{formatNumber(totalFiles)}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">File Extension Statistics</h3>
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <FileExtensionChart data={data.file_extension_stats} />
        </div>
      </div>
    </section>
  )
}

