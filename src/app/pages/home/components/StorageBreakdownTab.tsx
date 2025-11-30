import { useStorageBreakdown } from '@/api/features/storage/storage.queries'
import { bytesToGB } from '../hooks/useStorageUsage'
import { DocumentIcon, PhotoIcon, FolderIcon, FilmIcon, MusicalNoteIcon } from '@heroicons/react/24/solid'
import { useMemo } from 'react'
import Loading from '@/components/Loading/Loading'

function getFileTypeIcon(type: string) {
  const lower = type.toLowerCase()
  if (lower.includes('image') || lower.includes('photo') || lower.includes('png') || lower.includes('jpg') || lower.includes('jpeg')) {
    return PhotoIcon
  }
  if (lower.includes('video') || lower.includes('mp4') || lower.includes('mov')) {
    return FilmIcon
  }
  if (lower.includes('audio') || lower.includes('mp3') || lower.includes('wav')) {
    return MusicalNoteIcon
  }
  if (lower.includes('folder') || lower.includes('directory')) {
    return FolderIcon
  }
  return DocumentIcon
}

function getFileTypeColor(type: string) {
  const lower = type.toLowerCase()
  if (lower.includes('image') || lower.includes('photo')) return 'text-pink-500 bg-pink-50 dark:bg-pink-900/20'
  if (lower.includes('video')) return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20'
  if (lower.includes('audio')) return 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
  if (lower.includes('pdf')) return 'text-red-500 bg-red-50 dark:bg-red-900/20'
  if (lower.includes('word') || lower.includes('doc')) return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
  if (lower.includes('excel') || lower.includes('xls') || lower.includes('csv')) return 'text-green-500 bg-green-50 dark:bg-green-900/20'
  if (lower.includes('folder') || lower.includes('directory')) return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
  return 'text-gray-500 bg-gray-50 dark:bg-gray-800'
}

export default function StorageBreakdownTab() {
  const { data: storageBreakdown, isLoading } = useStorageBreakdown({})

  const sortedBreakdown = useMemo(() => {
    if (!storageBreakdown?.breakdown) return []
    return [...storageBreakdown.breakdown].sort((a, b) => b.total_size - a.total_size)
  }, [storageBreakdown])

  const totalSizeGB = useMemo(() => {
    if (!storageBreakdown?.total_size) return 0
    return bytesToGB(storageBreakdown.total_size)
  }, [storageBreakdown])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading size="lg" />
      </div>
    )
  }

  if (!storageBreakdown || sortedBreakdown.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-gray-500 dark:text-gray-400">No storage breakdown available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedBreakdown.map((item, index) => {
          const sizeGB = bytesToGB(item.total_size)
          const percentage = totalSizeGB > 0 ? (sizeGB / totalSizeGB) * 100 : 0
          const Icon = getFileTypeIcon(item.type)
          const colorClass = getFileTypeColor(item.type)

          return (
            <div
              key={index}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                      {item.type}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {item.count} {item.count === 1 ? 'file' : 'files'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Size</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {sizeGB.toFixed(2)} GB
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                  {percentage.toFixed(1)}% of total
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

