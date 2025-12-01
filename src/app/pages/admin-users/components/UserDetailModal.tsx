import { useEffect } from 'react'
import Offcanvas from '@/components/Offcanvas/Offcanvas'
import StorageUsage from '@/components/StorageUsage/StorageUsage'
import Loading from '@/components/Loading/Loading'
import type { User } from '@/api/features/users/users.types'
import type { UserStorageUsage } from '@/api/features/users/users.types'

interface UserDetailModalProps {
  userId: number | null
  userDetail: User | undefined
  storageUsage: UserStorageUsage | undefined
  isLoadingDetail: boolean
  isLoadingStorage: boolean
  onClose: () => void
}

export default function UserDetailModal({
  userId,
  userDetail,
  storageUsage,
  isLoadingDetail,
  isLoadingStorage,
  onClose,
}: UserDetailModalProps) {
  useEffect(() => {
    if (userId && !userDetail && !isLoadingDetail) {
      // User not found, will be handled by error state
    }
  }, [userId, userDetail, isLoadingDetail])

  const isLoading = isLoadingDetail || isLoadingStorage

  return (
    <Offcanvas
      id="detail-admin-user-offcanvas"
      title="Account details"
      alignment="right"
      width="25"
      open={userId !== null}
      onOpenChange={onClose}
      closeButton={true}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loading size="lg" />
        </div>
      ) : !userDetail ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">User not found</p>
        </div>
      ) : (
        <div className="space-y-4 text-sm">
          <div className="space-y-3">
            <div>
              <div className="text-gray-500 dark:text-gray-400">User ID</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">{userDetail.user_id}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Name</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">{userDetail.name}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Email</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">{userDetail.email}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Role</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                  userDetail.role === 'admin'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {userDetail.role}
                </span>
              </div>
            </div>
          </div>

          {storageUsage && typeof storageUsage.storage_limit === 'number' && typeof storageUsage.storage_used === 'number' && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Storage usage
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Used:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {(storageUsage.storage_used / (1024 * 1024 * 1024)).toFixed(2)} GB
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Limit:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {(storageUsage.storage_limit / (1024 * 1024 * 1024)).toFixed(2)} GB
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Usage:</span>
                  <span className={`font-medium ${
                    storageUsage.usage_percent >= 90
                      ? 'text-red-600 dark:text-red-400'
                      : storageUsage.usage_percent >= 70
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {storageUsage.usage_percent.toFixed(1)}%
                  </span>
                </div>
              </div>
              <StorageUsage
                used={storageUsage.storage_used / (1024 * 1024 * 1024)}
                total={storageUsage.storage_limit / (1024 * 1024 * 1024)}
                precision={2}
                colorClassName="bg-blue-500 dark:bg-blue-400"
              />
            </div>
          )}
        </div>
      )}
    </Offcanvas>
  )
}

