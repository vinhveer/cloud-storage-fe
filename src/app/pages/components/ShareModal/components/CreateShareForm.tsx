import { useState, useRef, useEffect } from 'react'
import { ArrowLeftIcon, UserCircleIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useCreateShare } from '@/api/features/share/share.mutations'
import { useUsers } from '@/api/features/users/users.queries'
import { useAlert } from '@/components/Alert/AlertProvider'
import Loading from '@/components/Loading/Loading'

interface CreateShareFormProps {
  initialShareableType?: 'file' | 'folder'
  initialShareableId?: number
  initialShareableName?: string
  onSuccess: () => void
  onCancel: () => void
}

type SelectedUser = {
  user_id: number
  name: string
  email?: string
}

export default function CreateShareForm({
  initialShareableType,
  initialShareableId,
  initialShareableName,
  onSuccess,
  onCancel,
}: CreateShareFormProps) {
  const shareableType = initialShareableType || 'file'
  const shareableId = initialShareableId || 0
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([])
  const [permission, setPermission] = useState('view')
  const [formError, setFormError] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const createShareMutation = useCreateShare()
  const { showAlert } = useAlert()

  const { data: usersData, isLoading: isLoadingUsers } = useUsers({
    search: searchQuery.trim() || undefined,
    per_page: 10,
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredUsers = usersData?.data
    ? usersData.data.filter((user) => !selectedUsers.some((su) => su.user_id === user.user_id))
    : []

  const handleSelectUser = (user: SelectedUser) => {
    setSelectedUsers((prev) => [...prev, user])
    setSearchQuery('')
    setShowDropdown(false)
    inputRef.current?.focus()
  }

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers((prev) => prev.filter((u) => u.user_id !== userId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!shareableId || shareableId <= 0) {
      setFormError('Invalid shareable ID.')
      return
    }

    if (selectedUsers.length === 0) {
      setFormError('Please select at least one user.')
      return
    }

    if (!permission.trim()) {
      setFormError('Permission is required.')
      return
    }

    try {
      await createShareMutation.mutateAsync({
        shareable_type: shareableType,
        shareable_id: shareableId,
        user_ids: selectedUsers.map((u) => u.user_id),
        permission,
      })
      showAlert({ type: 'success', message: 'Share created successfully' })
      onSuccess()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create share. Please try again.'
      setFormError(errorMessage)
      showAlert({ type: 'error', message: errorMessage })
    }
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onCancel}
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back
      </button>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Create Share{initialShareableName ? ` for "${initialShareableName}"` : ''}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Share this {shareableType} with other users
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Users
          </label>
          <div className="relative" ref={dropdownRef}>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowDropdown(true)
                }}
                onFocus={() => {
                  if (searchQuery.trim()) setShowDropdown(true)
                }}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {showDropdown && searchQuery.trim() && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                {isLoadingUsers ? (
                  <div className="flex items-center justify-center py-4">
                    <Loading size="sm" />
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                    No users found
                  </div>
                ) : (
                  <ul className="py-1">
                    {filteredUsers.map((user) => (
                      <li key={user.user_id}>
                        <button
                          type="button"
                          onClick={() => handleSelectUser({ user_id: user.user_id, name: user.name, email: user.email })}
                          className="w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                        >
                          <UserCircleIcon className="w-5 h-5 text-gray-400" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{user.name}</div>
                            {user.email && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {selectedUsers.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Selected Users ({selectedUsers.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user.user_id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm"
                >
                  <UserCircleIcon className="w-4 h-4" />
                  <span>{user.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user.user_id)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Permission
          </label>
          <select
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="view">View</option>
            <option value="edit">Edit</option>
          </select>
        </div>

        {formError && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
            <p className="text-sm text-red-800 dark:text-red-200">{formError}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createShareMutation.isPending || selectedUsers.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {createShareMutation.isPending ? (
              <>
                <Loading size="sm" />
                Creating...
              </>
            ) : (
              'Create Share'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

