import React from 'react'
import { useReceivedShares } from '@/api/features/share/share.queries'
import Loading from '@/components/Loading/Loading'
import { FolderIcon, DocumentIcon } from '@heroicons/react/24/outline'
import Pagination from '@/app/pages/my-files/components/Pagination'
import clsx from 'clsx'

export default function ReceivedSharesTab() {
  const [currentPage, setCurrentPage] = React.useState(1)
  const perPage = 20

  const { data: receivedSharesData, isLoading } = useReceivedShares({ page: currentPage, per_page: perPage })

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading size="lg" />
      </div>
    )
  }

  if (!receivedSharesData?.data || receivedSharesData.data.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-400">No received shares</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Shares shared with you will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Received Shares</h2>

      <div className="space-y-3">
        {receivedSharesData.data.map(share => (
          <div
            key={share.share_id}
            className={clsx(
              'flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700',
              'bg-gray-50 dark:bg-gray-800'
            )}
          >
            <div className="flex-shrink-0">
              {share.shareable_type === 'folder' ? (
                <FolderIcon className="w-8 h-8 text-blue-500" />
              ) : (
                <DocumentIcon className="w-8 h-8 text-gray-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {share.shareable_name}
                </h3>
                <span
                  className={clsx(
                    'text-xs px-2 py-0.5 rounded-full',
                    share.shareable_type === 'folder'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  )}
                >
                  {share.shareable_type}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                <span>
                  Shared by <span className="font-medium">{share.owner.name}</span>
                </span>
                <span className="capitalize">Permission: {share.permission}</span>
                <span>{formatDate(share.shared_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {receivedSharesData.pagination && receivedSharesData.pagination.total_pages > 1 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Pagination
            currentPage={receivedSharesData.pagination.current_page}
            totalPages={receivedSharesData.pagination.total_pages}
            totalItems={receivedSharesData.pagination.total_items}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}

