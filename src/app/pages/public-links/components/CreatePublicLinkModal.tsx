import { useState, useCallback } from 'react'
import { XMarkIcon, LinkIcon } from '@heroicons/react/24/outline'
import { useCreatePublicLink } from '@/api/features/public-link/public-link.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'
import { Button } from '@/components/Button/Button'
import Loading from '@/components/Loading/Loading'
import { useQueryClient } from '@tanstack/react-query'

export type CreatePublicLinkModalProps = {
  open: boolean
  onClose: () => void
  initialType?: 'file' | 'folder'
  initialId?: number
  initialName?: string
  onSuccess?: () => void
}

export default function CreatePublicLinkModal({
  open,
  onClose,
  initialType,
  initialId,
  initialName,
  onSuccess,
}: Readonly<CreatePublicLinkModalProps>) {
  const [permission, setPermission] = useState('view')
  const [expiredAt, setExpiredAt] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [createdLink, setCreatedLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const createMutation = useCreatePublicLink()
  const { showAlert } = useAlert()
  const queryClient = useQueryClient()

  const shareableType = initialType || 'file'
  const shareableId = initialId || 0

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setFormError(null)

      if (!shareableId || shareableId <= 0) {
        setFormError('Invalid shareable ID.')
        return
      }

      if (!permission.trim()) {
        setFormError('Permission is required.')
        return
      }

      if (expiredAt && new Date(expiredAt) <= new Date()) {
        setFormError('Expiration date must be in the future.')
        return
      }

      try {
        const result = await createMutation.mutateAsync({
          shareable_type: shareableType,
          shareable_id: shareableId,
          permission,
          expired_at: expiredAt || null,
        })

        const linkUrl = result.public_link?.url || `${window.location.origin}/public/${result.public_link?.token}`
        setCreatedLink(linkUrl)
        queryClient.invalidateQueries({ queryKey: ['public-links'] })
        showAlert({ type: 'success', message: result.message || 'Public link created successfully.' })
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create public link. Please try again.'
        setFormError(errorMessage)
        showAlert({ type: 'error', message: errorMessage })
      }
    },
    [shareableType, shareableId, permission, expiredAt, createMutation, showAlert, queryClient]
  )

  const handleCopyLink = useCallback(async () => {
    if (!createdLink) return
    try {
      await navigator.clipboard.writeText(createdLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      showAlert({ type: 'success', message: 'Link copied to clipboard' })
    } catch {
      showAlert({ type: 'error', message: 'Failed to copy link' })
    }
  }, [createdLink, showAlert])

  const handleClose = useCallback(() => {
    setPermission('view')
    setExpiredAt('')
    setFormError(null)
    setCreatedLink(null)
    setCopied(false)
    onClose()
  }, [onClose])

  const handleDone = useCallback(() => {
    onSuccess?.()
    handleClose()
  }, [onSuccess, handleClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-xl flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Create Public Link{initialName ? ` for "${initialName}"` : ''}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {createdLink ? (
            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-4 max-w-xl mx-auto">
                <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
                  <p className="text-sm text-green-800 dark:text-green-200 font-medium mb-2">
                    Public link created successfully!
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Public Link
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={createdLink}
                      className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-3 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2"
                    >
                      <LinkIcon className="w-4 h-4" />
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button type="button" variant="primary" size="md" onClick={handleDone}>
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6">
              <div className="space-y-4 max-w-xl mx-auto">
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
                    <option value="download">Download</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiration Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={expiredAt}
                    onChange={(e) => setExpiredAt(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Leave empty for no expiration
                  </p>
                </div>

                {formError && (
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                    <p className="text-sm text-red-800 dark:text-red-200">{formError}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button type="button" variant="secondary" size="md" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" disabled={createMutation.isPending}>
                  {createMutation.isPending ? (
                    <>
                      <Loading size="sm" className="mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Link'
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

