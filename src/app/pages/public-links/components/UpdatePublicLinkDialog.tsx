import Dialog from '@/components/Dialog/Dialog'
import type { DialogProps } from '@/components/Dialog/types'
import { useUpdatePublicLink } from '@/api/features/public-link/public-link.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'
import { useQueryClient } from '@tanstack/react-query'
import { useState, useCallback } from 'react'

export type UpdatePublicLinkDialogProps = Omit<DialogProps, 'onConfirm' | 'children'> & {
  publicLinkId: number
  currentPermission: string
  currentExpiredAt: string | null
  onSuccess?: () => void
}

export default function UpdatePublicLinkDialog({
  publicLinkId,
  currentPermission,
  currentExpiredAt,
  onSuccess,
  title = 'Update Public Link',
  confirmButtonText = 'Update',
  cancelButtonText = 'Cancel',
  confirmType = 'primary',
  ...dialogProps
}: Readonly<UpdatePublicLinkDialogProps>) {
  const [permission, setPermission] = useState(currentPermission)
  const [expiredAt, setExpiredAt] = useState(
    currentExpiredAt ? new Date(currentExpiredAt).toISOString().slice(0, 16) : ''
  )
  const [formError, setFormError] = useState<string | null>(null)

  const updateMutation = useUpdatePublicLink()
  const { showAlert } = useAlert()
  const queryClient = useQueryClient()

  const handleConfirm = useCallback(async () => {
    setFormError(null)

    if (expiredAt && new Date(expiredAt) <= new Date()) {
      setFormError('Expiration date must be in the future.')
      return
    }

    try {
      await updateMutation.mutateAsync({
        id: publicLinkId,
        permission: permission !== currentPermission ? permission : undefined,
        expired_at: expiredAt !== (currentExpiredAt ? new Date(currentExpiredAt).toISOString().slice(0, 16) : '')
          ? expiredAt || null
          : undefined,
      })
      showAlert({ type: 'success', message: 'Public link updated successfully.' })
      queryClient.invalidateQueries({ queryKey: ['public-links'] })
      queryClient.invalidateQueries({ queryKey: ['public-link-detail'] })
      onSuccess?.()
      dialogProps.onOpenChange?.(false)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update public link. Please try again.'
      setFormError(errorMessage)
      showAlert({ type: 'error', message: errorMessage })
    }
  }, [
    publicLinkId,
    permission,
    currentPermission,
    expiredAt,
    currentExpiredAt,
    updateMutation,
    showAlert,
    queryClient,
    onSuccess,
    dialogProps,
  ])

  return (
    <Dialog
      {...dialogProps}
      title={title}
      confirmButtonText={confirmButtonText}
      cancelButtonText={cancelButtonText}
      confirmType={confirmType}
      onConfirm={handleConfirm}
      buttonLayout="auto"
    >
      <div className="space-y-4">
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
            Leave empty for no expiration, or set a future date
          </p>
        </div>

        {formError && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
            <p className="text-sm text-red-800 dark:text-red-200">{formError}</p>
          </div>
        )}
      </div>
    </Dialog>
  )
}

