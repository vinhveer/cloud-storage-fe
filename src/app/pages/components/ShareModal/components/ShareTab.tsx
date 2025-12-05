import { useState } from 'react'
import {
  UserPlusIcon,
  TrashIcon,
  UsersIcon,
  DocumentIcon,
  FolderIcon,
  UserCircleIcon,
  NoSymbolIcon,
} from '@heroicons/react/24/outline'
import { useListShares, useShareByResource } from '@/api/features/share/share.queries'
import { useDeleteShare, useRemoveShareUser } from '@/api/features/share/share.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'
import Loading from '@/components/Loading/Loading'
import CreateShareForm from './CreateShareForm'
import ShareDetailModal from './ShareDetailModal'
import AddUsersForm from './AddUsersForm'
import type { ShareListItem } from '@/api/features/share/share.types'

interface ShareTabProps {
  initialShareableType?: 'file' | 'folder'
  initialShareableId?: number
  initialShareableName?: string
}

export default function ShareTab({
  initialShareableType,
  initialShareableId,
  initialShareableName,
}: ShareTabProps) {
  const [page, setPage] = useState(1)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showAddUsers, setShowAddUsers] = useState(false)
  const [selectedShareId, setSelectedShareId] = useState<number | null>(null)
  
  const { showAlert } = useAlert()
  
  // Mode: per-resource (when initialShareableId is provided)
  const isResourceMode = initialShareableType && initialShareableId && initialShareableId > 0
  
  // Fetch share by resource (for resource mode)
  const { 
    data: resourceShare, 
    isLoading: isLoadingResourceShare,
    isFetching: isFetchingResourceShare,
  } = useShareByResource(
    isResourceMode 
      ? { shareable_type: initialShareableType, shareable_id: initialShareableId }
      : null
  )
  
  // Fetch all shares (for dashboard mode)
  const { data: allSharesData, isLoading: isLoadingAllShares } = useListShares({ 
    page, 
    per_page: 10 
  })
  
  const deleteShareMutation = useDeleteShare()
  const removeUserMutation = useRemoveShareUser()

  const handleDeleteShare = async (shareId: number) => {
    if (!confirm('Are you sure you want to stop sharing? All users will lose access.')) return

    try {
      await deleteShareMutation.mutateAsync({ id: shareId })
      showAlert({ type: 'success', message: 'Stopped sharing successfully' })
    } catch {
      showAlert({ type: 'error', message: 'Failed to stop sharing' })
    }
  }

  const handleRemoveUser = async (userId: number, userName: string) => {
    if (!resourceShare?.share_id) return

    try {
      await removeUserMutation.mutateAsync({
        shareId: resourceShare.share_id,
        userId,
      })
      showAlert({ type: 'success', message: `Removed access for "${userName}"` })
    } catch {
      showAlert({ type: 'error', message: 'Failed to remove user' })
    }
  }

  const handleCreateSuccess = () => {
    setShowCreateForm(false)
  }

  const handleAddUsersSuccess = () => {
    setShowAddUsers(false)
  }

  // Show create form
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

  // Show add users form (for resource mode)
  if (showAddUsers && resourceShare) {
    return (
      <AddUsersForm
        shareId={resourceShare.share_id}
        shareName={resourceShare.shareable_name}
        onSuccess={handleAddUsersSuccess}
        onCancel={() => setShowAddUsers(false)}
      />
    )
  }

  // Show share detail (for dashboard mode)
  if (selectedShareId) {
    return (
      <ShareDetailModal
        shareId={selectedShareId}
        onClose={() => setSelectedShareId(null)}
      />
    )
  }

  // ========== RESOURCE MODE: Show share for specific file/folder ==========
  if (isResourceMode) {
    if (isLoadingResourceShare || isFetchingResourceShare) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loading size="lg" />
        </div>
      )
    }

    // No share exists for this resource
    if (!resourceShare) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
            {initialShareableType === 'file' ? (
              <DocumentIcon className="w-8 h-8 text-gray-400" />
            ) : (
              <FolderIcon className="w-8 h-8 text-blue-500" />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {initialShareableName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {initialShareableType === 'file' ? 'File' : 'Folder'}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-8 text-center">
            <UserCircleIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Only you have access
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
              This {initialShareableType} is private. Invite people to give them access.
            </p>
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <UserPlusIcon className="w-5 h-5" />
              Invite people
            </button>
          </div>
        </div>
      )
    }

    // Share exists - show users with access
    return (
      <div className="space-y-6">
        {/* Resource header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {initialShareableType === 'file' ? (
              <DocumentIcon className="w-8 h-8 text-gray-400" />
            ) : (
              <FolderIcon className="w-8 h-8 text-blue-500" />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {resourceShare.shareable_name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Shared by {resourceShare.shared_by.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAddUsers(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <UserPlusIcon className="w-4 h-4" />
            Add people
          </button>
        </div>

        {/* People with access */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            People with access ({resourceShare.shared_with.length})
          </h4>
          
          {resourceShare.shared_with.length === 0 ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <p className="text-sm">No users have been added yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {resourceShare.shared_with.map((user) => (
                <div
                  key={user.user_id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        Can {user.permission}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user.user_id, user.name)}
                    disabled={removeUserMutation.isPending}
                    className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    title="Remove access"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stop sharing button */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => handleDeleteShare(resourceShare.share_id)}
            disabled={deleteShareMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
          >
            <NoSymbolIcon className="w-4 h-4" />
            Stop sharing
          </button>
        </div>
      </div>
    )
  }

  // ========== DASHBOARD MODE: Show all shares ==========
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
      {isLoadingAllShares ? (
        <div className="flex items-center justify-center py-12">
          <Loading size="lg" />
        </div>
      ) : !allSharesData?.data || allSharesData.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <UsersIcon className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" />
          <p>No shares found</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Create a share to get started
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {allSharesData.data.map((share: ShareListItem) => (
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
                    handleDeleteShare(share.share_id)
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
          {allSharesData.pagination.total_pages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {allSharesData.pagination.current_page} of {allSharesData.pagination.total_pages}
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
                  onClick={() => setPage((p) => Math.min(allSharesData.pagination.total_pages, p + 1))}
                  disabled={page === allSharesData.pagination.total_pages}
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

