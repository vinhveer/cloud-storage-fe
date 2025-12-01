import { useState, useMemo } from 'react'
import { useAdminStorageStats } from '@/api/features/stats/stats.queries'
import Loading from '@/components/Loading/Loading'
import { formatBytes } from '../utils'
import StorageTimelineChart from './StorageTimelineChart'
import type { StorageStatsParams } from '@/api/features/stats/stats.types'

export default function StorageStatsSection() {
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [dateError, setDateError] = useState<string>('')

  const params: StorageStatsParams = useMemo(() => {
    const params: StorageStatsParams = {}
    if (startDate.trim()) {
      params.start_date = startDate.trim()
    }
    if (endDate.trim()) {
      params.end_date = endDate.trim()
    }
    return params
  }, [startDate, endDate])

  const { data, isLoading, error } = useAdminStorageStats(params)

  const validateDates = () => {
    setDateError('')
    if (!startDate && !endDate) {
      return true
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (startDate && !dateRegex.test(startDate)) {
      setDateError('Start date must be in YYYY-MM-DD format')
      return false
    }
    if (endDate && !dateRegex.test(endDate)) {
      setDateError('End date must be in YYYY-MM-DD format')
      return false
    }

    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (start > end) {
        setDateError('Start date must be less than or equal to end date')
        return false
      }
    }

    return true
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value)
    if (dateError) {
      validateDates()
    }
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value)
    if (dateError) {
      validateDates()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    validateDates()
    // Query will automatically refetch when params change
  }

  const availableDates = useMemo(() => {
    if (!data || data.storage_timeline.length === 0) return []
    return data.storage_timeline.map(p => p.date).sort()
  }, [data])

  const minAvailableDate = availableDates[0] || ''
  const maxAvailableDate = availableDates[availableDates.length - 1] || ''

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Storage Statistics</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              min={minAvailableDate || undefined}
              max={endDate || maxAvailableDate || undefined}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              min={startDate || minAvailableDate || undefined}
              max={maxAvailableDate || undefined}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
        </div>
        {dateError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-2 text-sm text-red-800 dark:text-red-200">
            {dateError}
          </div>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all duration-200"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={() => {
              setStartDate('')
              setEndDate('')
              setDateError('')
            }}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm font-medium transition-all duration-200"
          >
            Clear Filters
          </button>
          {data && data.storage_timeline.length > 0 && (
            <div className="ml-auto flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Quick select:</span>
              <button
                type="button"
                onClick={() => {
                  const timeline = data.storage_timeline
                  if (timeline.length >= 7) {
                    const end = timeline[timeline.length - 1].date
                    const start = timeline[Math.max(0, timeline.length - 7)].date
                    setStartDate(start)
                    setEndDate(end)
                    setDateError('')
                  }
                }}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              >
                Last 7 days
              </button>
              <button
                type="button"
                onClick={() => {
                  const timeline = data.storage_timeline
                  if (timeline.length >= 30) {
                    const end = timeline[timeline.length - 1].date
                    const start = timeline[Math.max(0, timeline.length - 30)].date
                    setStartDate(start)
                    setEndDate(end)
                    setDateError('')
                  }
                }}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              >
                Last 30 days
              </button>
            </div>
          )}
        </div>
      </form>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loading size="md" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 text-sm text-red-800 dark:text-red-200">
          Error loading storage stats: {error.message}
        </div>
      )}

      {data && (
        <>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">
              Average Growth per Day
            </p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {formatBytes(data.average_growth_per_day)}/day
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Storage Timeline</h3>
            {data.storage_timeline.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No data available for the selected period</p>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <StorageTimelineChart
                  data={data.storage_timeline}
                  onDateRangeChange={(start, end) => {
                    setStartDate(start)
                    setEndDate(end)
                    setDateError('')
                  }}
                />
              </div>
            )}
          </div>
        </>
      )}
    </section>
  )
}

