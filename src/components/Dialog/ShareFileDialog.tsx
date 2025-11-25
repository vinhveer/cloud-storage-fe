import React from 'react'
import Dialog from '@/components/Dialog/Dialog'
import type { DialogProps } from '@/components/Dialog/types'
import { useCreateShare } from '@/api/features/share/share.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'

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
  const [copied, setCopied] = React.useState(false)
  const [userIdsInput, setUserIdsInput] = React.useState('')
  const [permission, setPermission] = React.useState('view')
  const [formError, setFormError] = React.useState<string | null>(null)

  const createShareMutation = useCreateShare()
  const { showAlert } = useAlert()

  const effectiveLink = React.useMemo(
    () => shareLink ?? `${window.location.origin}/share/file/${fileId}`,
    [fileId, shareLink],
  )

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(effectiveLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      showAlert({ type: 'success', message: 'Đã sao chép liên kết' })
    } catch {
      // ignore
    }
  }

  const parseUserIds = (input: string): number[] => {
    return input
      .split(',')
      .map(part => part.trim())
      .filter(part => part !== '')
      .map(part => Number(part))
      .filter(id => !Number.isNaN(id) && id > 0)
  }

  const handleConfirm = async () => {
    setFormError(null)
    const userIds = parseUserIds(userIdsInput)
    if (userIds.length === 0) {
      setFormError('At least one valid user ID is required.')
      return
    }
    if (!permission.trim()) {
      setFormError('Permission is required.')
      return
    }

    await createShareMutation.mutateAsync({
      shareable_type: 'file',
      shareable_id: fileId,
      user_ids: userIds,
      permission,
    })
    dialogProps.onOpenChange?.(false)
  }

  return (
    <Dialog
      {...dialogProps}
      title={`${title} "${fileName}"`}
      confirmButtonText={confirmButtonText}
      cancelButtonText={cancelButtonText}
      confirmType={confirmType}
      onConfirm={handleConfirm}
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Copy a link to share this file.</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={effectiveLink}
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {copied ? 'Copied' : 'Copy link'}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Share with users</p>
          <label className="block text-xs text-gray-600 dark:text-gray-400">
            User IDs (comma separated)
          </label>
          <input
            type="text"
            value={userIdsInput}
            onChange={e => setUserIdsInput(e.target.value)}
            placeholder="e.g. 1, 2, 5"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200"
          />

          <label className="block text-xs text-gray-600 dark:text-gray-400 mt-2">
            Permission
          </label>
          <select
            value={permission}
            onChange={e => setPermission(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200"
          >
            <option value="view">View</option>
            <option value="edit">Edit</option>
          </select>

          {formError && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">{formError}</p>
          )}
        </div>
      </div>
    </Dialog>
  )
}
