import { useState, useEffect } from 'react'
import { Button } from '@/components/Button/Button'
import Offcanvas from '@/components/Offcanvas/Offcanvas'
import type { TableUser } from '../hooks/useUserManagement'

interface EditUserModalProps {
  user: TableUser | null
  onClose: () => void
  onSubmit: (userId: number, name: string, storageLimit: number | undefined) => Promise<void>
  isLoading: boolean
}

export default function EditUserModal({ user, onClose, onSubmit, isLoading }: EditUserModalProps) {
  const [name, setName] = useState('')
  const [storageLimit, setStorageLimit] = useState<number | ''>('')

  useEffect(() => {
    if (user) {
      setName(user.name ?? '')
      setStorageLimit(typeof user.storage_limit === 'number' ? user.storage_limit : '')
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const limit = storageLimit === '' || Number.isNaN(Number(storageLimit)) ? undefined : Number(storageLimit)
    try {
      await onSubmit(user.user_id, name.trim(), limit)
    } catch {
      // Error handled by parent
    }
  }

  if (!user) return null

  return (
    <Offcanvas
      id="edit-admin-user-offcanvas"
      title="Edit account"
      alignment="right"
      width="25"
      open={Boolean(user)}
      onOpenChange={onClose}
      closeButton={true}
    >
      <form className="flex flex-col h-full min-h-0" onSubmit={handleSubmit}>
        <div className="flex-1 space-y-4 overflow-y-auto min-h-0">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="edit-name">
              Name
            </label>
            <input
              id="edit-name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="edit-email">
              Email
            </label>
            <input
              id="edit-email"
              type="email"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm"
              value={user.email}
              disabled
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="edit-storage-limit">
              Storage limit (bytes)
            </label>
            <input
              id="edit-storage-limit"
              type="number"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm"
              value={storageLimit}
              onChange={e =>
                setStorageLimit(e.target.value === '' ? '' : Number(e.target.value) || '')
              }
              min={0}
              placeholder="Leave empty for unlimited"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
          <Button
            variant="secondary"
            size="md"
            type="button"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            isLoading={isLoading}
            value="Save"
          />
        </div>
      </form>
    </Offcanvas>
  )
}

