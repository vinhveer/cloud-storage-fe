import { useState } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useCreatePublicLink } from '@/api/features/public-link/public-link.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'
import Loading from '@/components/Loading/Loading'

interface CreatePublicLinkFormProps {
  initialShareableType?: 'file' | 'folder'
  initialShareableId?: number
  initialShareableName?: string
  onSuccess: () => void
  onCancel: () => void
}

export default function CreatePublicLinkForm({
  initialShareableType,
  initialShareableId,
  initialShareableName,
  onSuccess,
  onCancel,
}: CreatePublicLinkFormProps) {
  const shareableType = initialShareableType || 'file'
  const shareableId = initialShareableId || 0
  const [permission, setPermission] = useState('view')
  const [expiredAt, setExpiredAt] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const createMutation = useCreatePublicLink()
  const { showAlert } = useAlert()

  const handleSubmit = async (e: React.FormEvent) => {
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
      await createMutation.mutateAsync({
        shareable_type: shareableType,
        shareable_id: shareableId,
        permission,
        expired_at: expiredAt || null,
      })
      showAlert({ type: 'success', message: 'Public link created successfully' })
      onSuccess()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create public link. Please try again.'
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
          Create Public Link{initialShareableName ? ` for "${initialShareableName}"` : ''}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Create a public link for this {shareableType}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={createMutation.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {createMutation.isPending ? (
              <>
                <Loading size="sm" />
                Creating...
              </>
            ) : (
              'Create Link'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

