import {
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  MinusIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { formatFileSize, formatDateTime } from '../utils'

interface VersionListItemProps {
  version: {
    version_id: number
    version_number: number
    file_size: number
    created_at: string
    notes?: string | null
    action?: string | null
  }
  isLatest: boolean
  isSelected: boolean
  onViewDetail: () => void
  onDownload: () => void
  onRestore: () => void
  onDelete: () => void
}

export default function VersionListItem({
  version,
  isLatest,
  isSelected,
  onViewDetail,
  onDownload,
  onRestore,
  onDelete,
}: VersionListItemProps) {
  return (
    <div
      className={clsx(
        'p-4 rounded-lg border transition-colors',
        isLatest
          ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
        isSelected ? 'ring-2 ring-blue-500' : ''
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Version {version.version_number}
            </span>
            {isLatest && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                Latest
              </span>
            )}
            {version.action && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({version.action})
              </span>
            )}
          </div>
          {version.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 break-words">
              {version.notes}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>{formatFileSize(version.file_size)}</span>
            <MinusIcon className="w-3 h-3 rotate-90" />
            <span>{formatDateTime(version.created_at)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onViewDetail}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="View details"
          >
            <InformationCircleIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Download version"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
          </button>
          {!isLatest && (
            <button
              type="button"
              onClick={onRestore}
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Restore version"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          )}
          <button
            type="button"
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Delete version"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

