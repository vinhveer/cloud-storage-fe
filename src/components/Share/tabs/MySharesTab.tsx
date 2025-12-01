import React from 'react'
import { useListShares } from '@/api/features/share/share.queries'
import { useDeleteShare } from '@/api/features/share/share.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'
import { useQueryClient } from '@tanstack/react-query'
import Loading from '@/components/Loading/Loading'
import { TrashIcon, EyeIcon, FolderIcon, DocumentIcon } from '@heroicons/react/24/outline'
import Pagination from '@/app/pages/my-files/components/Pagination'
import clsx from 'clsx'

export type MySharesTabProps = {
  onShareClick: (shareId: number) => void
}

export default function MySharesTab({ onShareClick }: Readonly<MySharesTabProps>) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const perPage = 20

  const { data: sharesData, isLoading } = useListShares({ page: currentPage, per_page: perPage })
  const deleteShareMutation = useDeleteShare()
  const { showAlert } = useAlert()
  const queryClient = useQueryClient()

  const handleDelete = async (shareId: number, shareableName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`Are you sure you want to delete the share for "${shareableName}"?`)) return

    try {
      await deleteShareMutation.mutateAsync({ id: shareId })
      showAlert({ type: 'success', message: 'Share deleted successfully.' })
      await queryClient.invalidateQueries({ queryKey: ['shares'] })
    } catch {
      showAlert({ type: 'error', message: 'Failed to delete share. Please try again.' })
    }
  }

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

  if (!sharesData?.data || sharesData.data.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-400">No shares found</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Create a share to get started
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">My Shares</h2>

      <div className="space-y-3">
        {sharesData.data.map(share => (
          <div
            key={share.share_id}
            onClick={() => onShareClick(share.share_id)}
            className={clsx(
              'flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700',
              'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors'
            )}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
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
                  <span>Shared with {share.shared_with_count} user(s)</span>
                  <span>{formatDate(share.created_at)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation()
                  onShareClick(share.share_id)
                }}
                className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="View details"
              >
                <EyeIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={e => handleDelete(share.share_id, share.shareable_name, e)}
                disabled={deleteShareMutation.isPending}
                className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                title="Delete share"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {sharesData.pagination && sharesData.pagination.total_pages > 1 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Pagination
            currentPage={sharesData.pagination.current_page}
            totalPages={sharesData.pagination.total_pages}
            totalItems={sharesData.pagination.total_items}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}

