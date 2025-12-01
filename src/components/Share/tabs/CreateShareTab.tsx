import React from 'react'
import { useCreateShare } from '@/api/features/share/share.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'
import { Button } from '@/components/Button/Button'
import Loading from '@/components/Loading/Loading'
import { useUsers } from '@/api/features/users/users.queries'
import { MagnifyingGlassIcon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline'

export type CreateShareTabProps = {
  initialType?: 'file' | 'folder'
  initialId?: number
  initialName?: string
  onSuccess?: () => void
}

type SelectedUser = {
  user_id: number
  name: string
  email?: string
}

export default function CreateShareTab({
  initialType,
  initialId,
  onSuccess,
}: Readonly<CreateShareTabProps>) {
  const shareableType = initialType || 'file'
  const shareableId = initialId || 0
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedUsers, setSelectedUsers] = React.useState<SelectedUser[]>([])
  const [permission, setPermission] = React.useState('view')
  const [formError, setFormError] = React.useState<string | null>(null)
  const [showDropdown, setShowDropdown] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const createShareMutation = useCreateShare()
  const { showAlert } = useAlert()

  const { data: usersData, isLoading: isLoadingUsers } = useUsers({
    search: searchQuery.trim() || undefined,
    per_page: 10,
  })

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredUsers = React.useMemo(() => {
    if (!usersData?.data) return []
    const selectedIds = new Set(selectedUsers.map(u => u.user_id))
    return usersData.data.filter(user => !selectedIds.has(user.user_id))
  }, [usersData, selectedUsers])

  const handleSelectUser = (user: SelectedUser) => {
    setSelectedUsers(prev => [...prev, user])
    setSearchQuery('')
    setShowDropdown(false)
    inputRef.current?.focus()
  }

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers(prev => prev.filter(u => u.user_id !== userId))
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
      const result = await createShareMutation.mutateAsync({
        shareable_type: shareableType,
        shareable_id: shareableId,
        user_ids: selectedUsers.map(u => u.user_id),
        permission,
      })

      const addedCount = result.added_user_ids.length
      const updatedCount = result.updated_user_ids.length
      const skippedCount = result.skipped_user_ids.length

      let message = 'Share created successfully.'
      if (addedCount > 0) message += ` ${addedCount} user(s) added.`
      if (updatedCount > 0) message += ` ${updatedCount} user(s) updated.`
      if (skippedCount > 0) message += ` ${skippedCount} user(s) skipped.`

      showAlert({ type: 'success', message })
      setSelectedUsers([])
      setSearchQuery('')
      setFormError(null)
      onSuccess?.()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create share. Please try again.'
      setFormError(errorMessage)
      showAlert({ type: 'error', message: errorMessage })
    }
  }

  const shareLink = React.useMemo(
    () => (shareableId ? `${window.location.origin}/share/${shareableType}/${shareableId}` : ''),
    [shareableType, shareableId]
  )

  const handleCopyLink = async () => {
    if (!shareLink) return
    try {
      await navigator.clipboard.writeText(shareLink)
      showAlert({ type: 'success', message: 'Link copied to clipboard' })
    } catch {
      showAlert({ type: 'error', message: 'Failed to copy link' })
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Share</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {shareLink && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Share Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareLink}
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200"
                />
                <Button type="button" variant="secondary" size="md" onClick={handleCopyLink}>
                  Copy
                </Button>
              </div>
            </div>
          )}

          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Share with users
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500">
                <MagnifyingGlassIcon className="w-5 h-5" aria-hidden="true" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowDropdown(true)
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search by name or email..."
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setShowDropdown(false)
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="w-5 h-5" aria-hidden="true" />
                </button>
              )}
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

            {selectedUsers.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.user_id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-sm"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      {user.email && (
                        <span className="text-xs text-blue-600 dark:text-blue-300">{user.email}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveUser(user.user_id)}
                      className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 ml-1"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Permission
            </label>
            <select
              value={permission}
              onChange={e => setPermission(e.target.value)}
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
        </div>

        <div className="flex justify-end gap-3">
          <Button type="submit" variant="primary" size="md" disabled={createShareMutation.isPending}>
            {createShareMutation.isPending ? (
              <>
                <Loading size="sm" className="mr-2" />
                Creating...
              </>
            ) : (
              'Share'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
