import React, { useRef, useEffect } from 'react'
import Dialog from '@/components/Dialog/Dialog'
import type { DialogProps } from '@/components/Dialog/types'
import { useCreateShare, useRemoveShareUser } from '@/api/features/share/share.mutations'
import { useShareByResource } from '@/api/features/share/share.queries'
import { useUsers } from '@/api/features/users/users.queries'
import { useAlert } from '@/components/Alert/AlertProvider'
import { UserCircleIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Loading from '@/components/Loading/Loading'

export type ShareFileDialogProps = Omit<DialogProps, 'onConfirm' | 'children' | 'title'> & {
  fileId: number
  fileName: string
  /** Optional predefined share link; if not provided, a default will be generated from fileId */
  shareLink?: string
  title?: string
}

export default function ShareFileDialog({
  fileId,
  fileName,
  shareLink,
  title = 'Share',
  confirmButtonText = 'Done',
  cancelButtonText = 'Cancel',
  confirmType = 'primary',
  ...dialogProps
}: Readonly<ShareFileDialogProps>) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedUsers, setSelectedUsers] = React.useState<Array<{ user_id: number; name: string; email?: string }>>([])
  const [formError, setFormError] = React.useState<string | null>(null)
  const [showDropdown, setShowDropdown] = React.useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const createShareMutation = useCreateShare()
  const removeShareUserMutation = useRemoveShareUser()
  const { showAlert } = useAlert()
  
  const { data: shareData, isLoading: isLoadingShare } = useShareByResource({ shareable_type: 'file', shareable_id: fileId })
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
    ? usersData.data.filter((user) => 
        !selectedUsers.some((su) => su.user_id === user.user_id) &&
        !shareData?.shared_with.some((sw) => sw.user_id === user.user_id)
      )
    : []

  const handleSelectUser = (user: { user_id: number; name: string; email?: string }) => {
    setSelectedUsers((prev) => [...prev, user])
    setSearchQuery('')
    setShowDropdown(false)
    inputRef.current?.focus()
  }

  const handleRemoveSelectedUser = (userId: number) => {
    setSelectedUsers((prev) => prev.filter((u) => u.user_id !== userId))
  }

  const handleAddUsers = async () => {
    setFormError(null)
    if (selectedUsers.length === 0) {
      setFormError('Please select at least one user.')
      return
    }

    try {
      // Always use createShare which will create share if not exists or add users if exists
      await createShareMutation.mutateAsync({
        shareable_type: 'file',
        shareable_id: fileId,
        user_ids: selectedUsers.map(u => u.user_id),
        permission: 'download',
      })
      showAlert({ type: 'success', message: 'Users added successfully.' })
      setSelectedUsers([])
    } catch {
      showAlert({ type: 'error', message: 'Failed to add users. Please try again.' })
    }
  }

  const handleRemoveUser = async (userId: number) => {
    if (!shareData?.share_id) return
    try {
      await removeShareUserMutation.mutateAsync({
        shareId: shareData.share_id,
        userId,
      })
      showAlert({ type: 'success', message: 'User removed successfully.' })
    } catch {
      showAlert({ type: 'error', message: 'Failed to remove user.' })
    }
  }

  return (
    <Dialog
      {...dialogProps}
      title={`${title} "${fileName}"`}
      confirmButtonText={confirmButtonText}
      cancelButtonText={cancelButtonText}
      confirmType={confirmType}
      onConfirm={() => dialogProps.onOpenChange?.(false)}
    >
      <div className="space-y-4">
        {/* Shared users list */}
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-2">People with access</p>
          {isLoadingShare ? (
            <div className="flex justify-center py-4">
              <Loading size="sm" />
            </div>
          ) : shareData && shareData.shared_with.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {shareData.shared_with.map((user) => (
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
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveUser(user.user_id)}
                    disabled={removeShareUserMutation.isPending}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                    title="Remove access"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm py-4 text-center">
              No users have access
            </p>
          )}
        </div>

        {/* Add users */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Add people</p>
          
          {/* Search input */}
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

          {/* Selected users */}
          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">Selected ({selectedUsers.length})</p>
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
                      onClick={() => handleRemoveSelectedUser(user.user_id)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add button */}
          <button
            type="button"
            onClick={handleAddUsers}
            disabled={createShareMutation.isPending || selectedUsers.length === 0}
            className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {createShareMutation.isPending ? 'Adding...' : `Add ${selectedUsers.length > 0 ? `(${selectedUsers.length})` : ''}`}
          </button>

          {formError && (
            <p className="text-xs text-red-600 dark:text-red-400">{formError}</p>
          )}
        </div>
      </div>
    </Dialog>
  )
}
