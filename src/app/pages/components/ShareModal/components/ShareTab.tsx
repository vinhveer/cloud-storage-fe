import { useState } from 'react'
import {
  UserPlusIcon,
  TrashIcon,
  UsersIcon,
  DocumentIcon,
  FolderIcon,
} from '@heroicons/react/24/outline'
import { useListShares } from '@/api/features/share/share.queries'
import { useDeleteShare } from '@/api/features/share/share.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'
import Loading from '@/components/Loading/Loading'
import CreateShareForm from './CreateShareForm'
import ShareDetailModal from './ShareDetailModal'
import type { ShareListItem } from '@/api/features/share/share.types'

interface ShareTabProps {
  initialShareableType?: 'file' | 'folder'
  initialShareableId?: number
  initialShareableName?: string
  onRefresh: () => void
}

export default function ShareTab({
  initialShareableType,
  initialShareableId,
  initialShareableName,
  onRefresh,
}: ShareTabProps) {
  const [page, setPage] = useState(1)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedShareId, setSelectedShareId] = useState<number | null>(null)
  const { data, isLoading } = useListShares({ page, per_page: 10 })
  const deleteShareMutation = useDeleteShare()
  const { showAlert } = useAlert()

  const handleDelete = async (shareId: number) => {
    if (!confirm('Are you sure you want to delete this share?')) return

    try {
      await deleteShareMutation.mutateAsync({ id: shareId })
      showAlert({ type: 'success', message: 'Share deleted successfully' })
      onRefresh()
    } catch {
      showAlert({ type: 'error', message: 'Failed to delete share' })
    }
  }

  const handleCreateSuccess = () => {
    setShowCreateForm(false)
    onRefresh()
  }

  if (showCreateForm) {
    return (
      <CreateShareForm
        initialShareableType={initialShareableType}
        initialShareableId={initialShareableId}
        initialShareableName={initialShareableName}
        onSuccess={handleCreateSuccess}
        onCancel={() => setShowCreateForm(false)}
      />
    )
  }

  if (selectedShareId) {
    return (
      <ShareDetailModal
        shareId={selectedShareId}
        onClose={() => setSelectedShareId(null)}
        onRefresh={onRefresh}
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          My Shares
        </h3>
        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlusIcon className="w-5 h-5" />
          Create Share
        </button>
      </div>

      {/* Share List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loading size="lg" />
        </div>
      ) : !data?.data || data.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <UsersIcon className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" />
          <p>No shares found</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Create a share to get started
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.data.map((share: ShareListItem) => (
            <div
              key={share.share_id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={() => setSelectedShareId(share.share_id)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {share.shareable_type === 'file' ? (
                  <DocumentIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                ) : (
                  <FolderIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {share.shareable_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Shared with {share.shared_with_count} {share.shared_with_count === 1 ? 'person' : 'people'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(share.share_id)
                  }}
                  disabled={deleteShareMutation.isPending}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {data.pagination.total_pages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {data.pagination.current_page} of {data.pagination.total_pages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(data.pagination.total_pages, p + 1))}
                  disabled={page === data.pagination.total_pages}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

