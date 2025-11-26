import React from 'react'
import { FolderIcon } from '@heroicons/react/24/outline'
import type { FileItem } from '@/components/FileList/types'
import { useUpdateFolder } from '@/api/features/folder/folder.mutations'

interface FolderDetailPanelProps {
  folder: FileItem | null
  open: boolean
  onClose: () => void
}

export default function FolderDetailPanel({ folder, open, onClose }: Readonly<FolderDetailPanelProps>) {
  const [name, setName] = React.useState(folder?.name ?? '')
  const updateFolderMutation = useUpdateFolder()

  React.useEffect(() => {
    setName(folder?.name ?? '')
  }, [folder?.name])

  if (!open || !folder || !folder.id) return null

  const handleSubmit: React.FormEventHandler = async event => {
    event.preventDefault()
    if (!name.trim()) return

    await updateFolderMutation.mutateAsync({
      folderId: Number(folder.id),
      folder_name: name.trim(),
    })
    onClose()
  }

  return (
    <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl border-l border-gray-200 dark:border-gray-800 z-40 flex flex-col">
      <header className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
            <FolderIcon className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-100 truncate">{folder.name}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Update folder</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none"
          aria-label="Close folder details"
        >
          ×
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        <section>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Folder name
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-800 dark:text-gray-100"
              placeholder="Enter folder name"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateFolderMutation.isPending || !name.trim()}
                className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white disabled:opacity-60"
              >
                {updateFolderMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </aside>
  )
}
