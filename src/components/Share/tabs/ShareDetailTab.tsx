import { useShareDetail } from '@/api/features/share/share.queries'
import { useRemoveShareUser, useDeleteShare } from '@/api/features/share/share.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'
import { useQueryClient } from '@tanstack/react-query'
import Loading from '@/components/Loading/Loading'
import { TrashIcon, UserCircleIcon, ArrowLeftIcon, FolderIcon, DocumentIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/Button/Button'
import clsx from 'clsx'

export type ShareDetailTabProps = {
  shareId: number
  onBack: () => void
}

export default function ShareDetailTab({ shareId, onBack }: Readonly<ShareDetailTabProps>) {
  const { data: shareDetail, isLoading } = useShareDetail(shareId)
  const removeUserMutation = useRemoveShareUser()
  const deleteShareMutation = useDeleteShare()
  const { showAlert } = useAlert()
  const queryClient = useQueryClient()

  const handleRemoveUser = async (userId: number, userName: string) => {
    if (!confirm(`Are you sure you want to remove "${userName}" from this share?`)) return

    try {
      await removeUserMutation.mutateAsync({ shareId, userId })
      showAlert({ type: 'success', message: `Removed access for "${userName}"` })
      await queryClient.invalidateQueries({ queryKey: ['share-detail', shareId] })
      await queryClient.invalidateQueries({ queryKey: ['shares'] })
    } catch {
      showAlert({ type: 'error', message: 'Failed to remove user. Please try again.' })
    }
  }

  const handleDeleteShare = async () => {
    if (!shareDetail) return
    if (!confirm(`Are you sure you want to delete the share for "${shareDetail.shareable_name}"?`)) return

    try {
      await deleteShareMutation.mutateAsync({ id: shareId })
      showAlert({ type: 'success', message: 'Share deleted successfully.' })
      await queryClient.invalidateQueries({ queryKey: ['shares'] })
      onBack()
    } catch {
      showAlert({ type: 'error', message: 'Failed to delete share. Please try again.' })
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
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

  if (!shareDetail) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500 dark:text-gray-400">Share not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="secondary" size="md" onClick={onBack}>
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Share Detail</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {shareDetail.shareable_type === 'folder' ? (
                <FolderIcon className="w-10 h-10 text-blue-500" />
              ) : (
                <DocumentIcon className="w-10 h-10 text-gray-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {shareDetail.shareable_name}
                </h3>
                <span
                  className={clsx(
                    'text-xs px-2 py-1 rounded-full',
                    shareDetail.shareable_type === 'folder'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  )}
                >
                  {shareDetail.shareable_type}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <p>
                  Created: <span className="font-medium">{formatDate(shareDetail.created_at)}</span>
                </p>
                {shareDetail.shared_by && (
                  <p>
                    Shared by: <span className="font-medium">{shareDetail.shared_by.name}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              People with access ({shareDetail.shared_with.length})
            </h3>
            <Button variant="danger" size="sm" onClick={handleDeleteShare} disabled={deleteShareMutation.isPending}>
              {deleteShareMutation.isPending ? 'Deleting...' : 'Delete Share'}
            </Button>
          </div>

          {shareDetail.shared_with.length === 0 ? (
            <div className="text-center py-8 border border-gray-200 dark:border-gray-700 rounded-lg">
              <UserCircleIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No users have access to this share
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {shareDetail.shared_with.map(user => (
                <div
                  key={user.user_id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {user.permission}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user.user_id, user.name)}
                    disabled={removeUserMutation.isPending}
                    className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                    title="Remove access"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

