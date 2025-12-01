import { useState, useEffect } from 'react'
import Dialog from '@/components/Dialog/Dialog'
import type { TableUser } from '../hooks/useUserManagement'

interface ChangeRoleDialogProps {
  user: TableUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (userId: number, role: 'user' | 'admin') => Promise<void>
  isLoading: boolean
}

export default function ChangeRoleDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: ChangeRoleDialogProps) {
  const [role, setRole] = useState<'user' | 'admin'>('user')

  useEffect(() => {
    if (user) {
      setRole((user.role as 'user' | 'admin') ?? 'user')
    }
  }, [user])

  const handleConfirm = async () => {
    if (!user) return
    try {
      await onConfirm(user.user_id, role)
    } catch {
      // Error handled by parent
    }
  }

  if (!user) return null

  const isChangingFromAdmin = user.role === 'admin' && role === 'user'

  return (
    <Dialog
      id="change-role-dialog"
      title="Change user role"
      open={open}
      onOpenChange={onOpenChange}
      confirmButtonText="Save"
      cancelButtonText="Cancel"
      confirmType="primary"
      onCancel={() => {
        if (isLoading) return
        onOpenChange(false)
      }}
      onConfirm={handleConfirm}
    >
      <div className="space-y-5">
        <div className="space-y-1.5">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {user.name}
          </p>
        </div>

        {isChangingFromAdmin && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Warning: Changing role from Admin to User will remove admin privileges.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</span>
          <div className="inline-flex w-full gap-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 p-1">
            <button
              type="button"
              className={[
                'flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all',
                role === 'user'
                  ? 'bg-white dark:bg-gray-900 border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'bg-transparent border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/60',
                isLoading && 'opacity-60 cursor-not-allowed',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => {
                if (isLoading) return
                setRole('user')
              }}
            >
              User
            </button>
            <button
              type="button"
              className={[
                'flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all',
                role === 'admin'
                  ? 'bg-white dark:bg-gray-900 border-purple-500 text-purple-600 dark:text-purple-300 shadow-sm'
                  : 'bg-transparent border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/60',
                isLoading && 'opacity-60 cursor-not-allowed',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => {
                if (isLoading) return
                setRole('admin')
              }}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

