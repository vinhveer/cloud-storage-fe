import Offcanvas from '@/components/Offcanvas/Offcanvas'
import Loading from '@/components/Loading/Loading'
import { TrashIcon } from '@heroicons/react/24/outline'
import type { ShareDetail } from '@/api/features/share/share.types'

export type ManageAccessOffcanvasProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  shareDetail: ShareDetail | undefined
  isLoading: boolean
  onRemoveUser: (userId: number) => void
  isRemoving: boolean
}

export default function ManageAccessOffcanvas({
  open,
  onOpenChange,
  shareDetail,
  isLoading,
  onRemoveUser,
  isRemoving,
}: Readonly<ManageAccessOffcanvasProps>) {
  return (
    <Offcanvas
      title="Manage Access"
      open={open}
      onOpenChange={onOpenChange}
      closeButton
      width="25"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loading size="lg" />
        </div>
      ) : shareDetail ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage who has access to <strong>{shareDetail.shareable_name}</strong>
          </p>

          <div className="space-y-2">
            {shareDetail.shared_with.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm py-4 text-center">
                No users have access
              </p>
            ) : (
              shareDetail.shared_with.map((user) => (
                <div
                  key={user.user_id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        Can {user.permission}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveUser(user.user_id)}
                    disabled={isRemoving}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                    title="Remove access"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No access data available</p>
      )}
    </Offcanvas>
  )
}

