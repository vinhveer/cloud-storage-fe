import Dialog from '@/components/Dialog/Dialog'
import type { TableUser } from '../hooks/useUserManagement'

interface DeleteUserDialogProps {
  users: TableUser[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  isLoading: boolean
}

export default function DeleteUserDialog({
  users,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteUserDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm()
    } catch {
      // Error handled by parent
    }
  }

  return (
    <Dialog
      id="delete-admin-user-dialog"
      title="Delete account"
      open={open}
      onOpenChange={onOpenChange}
      confirmButtonText="Delete"
      cancelButtonText="Cancel"
      confirmType="danger"
      onCancel={() => {
        if (isLoading) return
        onOpenChange(false)
      }}
      onConfirm={handleConfirm}
    >
      <div className="space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {users.length === 1 ? (
            <>
              Are you sure you want to delete account{' '}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {users[0].name}
              </span>
              ? This action cannot be undone.
            </>
          ) : (
            <>
              Are you sure you want to delete{' '}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {users.length}
              </span>{' '}
              selected accounts? This action cannot be undone.
            </>
          )}
        </p>
        {users.length === 1 && users[0].storage_used > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Warning: This user has {((users[0].storage_used || 0) / (1024 * 1024 * 1024)).toFixed(2)} GB of data.
              Deleting this account will permanently remove all associated files and folders.
            </p>
          </div>
        )}
      </div>
    </Dialog>
  )
}

