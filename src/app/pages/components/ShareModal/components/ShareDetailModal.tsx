import { useState } from 'react'
import { ArrowLeftIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import { useShareDetail } from '@/api/features/share/share.queries'
import { useRemoveShareUser } from '@/api/features/share/share.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'
import Loading from '@/components/Loading/Loading'
import AddUsersForm from './AddUsersForm'

interface ShareDetailModalProps {
  shareId: number
  onClose: () => void
  onRefresh: () => void
}

export default function ShareDetailModal({ shareId, onClose, onRefresh }: ShareDetailModalProps) {
  const [showAddUsers, setShowAddUsers] = useState(false)
  const { data: shareDetail, isLoading } = useShareDetail(shareId)
  const removeUserMutation = useRemoveShareUser()
  const { showAlert } = useAlert()

  const handleRemoveUser = async (userId: number) => {
    if (!confirm('Are you sure you want to remove this user?')) return

    try {
      await removeUserMutation.mutateAsync({ shareId, userId })
      showAlert({ type: 'success', message: 'User removed successfully' })
      onRefresh()
    } catch {
      showAlert({ type: 'error', message: 'Failed to remove user' })
    }
  }

  const handleAddUsersSuccess = () => {
    setShowAddUsers(false)
    onRefresh()
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
        <p className="text-gray-500 dark:text-gray-400">Share not found</p>
      </div>
    )
  }

  if (showAddUsers) {
    return (
      <AddUsersForm
        shareId={shareId}
        shareName={shareDetail.shareable_name}
        onSuccess={handleAddUsersSuccess}
        onCancel={() => setShowAddUsers(false)}
      />
    )
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back
      </button>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Share Details
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {shareDetail.shareable_name}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Shared By
          </h4>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-900 dark:text-white">{shareDetail.shared_by.name}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Shared With ({shareDetail.shared_with.length})
            </h4>
            <button
              type="button"
              onClick={() => setShowAddUsers(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <UserPlusIcon className="w-4 h-4" />
              Add Users
            </button>
          </div>

          {shareDetail.shared_with.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
              No users have access
            </div>
          ) : (
            <div className="space-y-2">
              {shareDetail.shared_with.map((user) => (
                <div
                  key={user.user_id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      Can {user.permission}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user.user_id)}
                    disabled={removeUserMutation.isPending}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
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

