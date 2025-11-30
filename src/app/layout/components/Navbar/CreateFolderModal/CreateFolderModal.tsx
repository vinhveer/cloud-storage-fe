import { Button } from '@/components/Button/Button'
import { useCreateFolderModal } from './hooks/useCreateFolderModal'
import type { CreateFolderModalProps } from './types'

export default function CreateFolderModal({
  open,
  onClose,
  currentFolderId = null,
}: Readonly<CreateFolderModalProps>) {
  const { newFolderName, setNewFolderName, createFolderMutation, handleCreate } = useCreateFolderModal({
    currentFolderId,
    onSuccess: onClose,
  })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 mx-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Create new folder</h2>
        <label className="block mb-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Folder name</span>
          <input
            autoFocus
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Project Docs"
          />
        </label>
        {createFolderMutation.isError && (
          <p className="text-xs text-red-500 mb-2" role="alert">
            {createFolderMutation.error?.message || 'Failed to create folder.'}
          </p>
        )}
        <div className="flex justify-end gap-2 mt-2">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            disabled={!newFolderName.trim() || createFolderMutation.status === 'pending'}
            onClick={handleCreate}
            isLoading={createFolderMutation.status === 'pending'}
            loadingText="Creating..."
          >
            Create folder
          </Button>
        </div>
      </div>
    </div>
  )
}

