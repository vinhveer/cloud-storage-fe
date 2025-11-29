import React from 'react'
import FileList from '@/components/FileList'
import { Button } from '@/components/Button/Button'
import type { FileItem } from '@/components/FileList'
import type { SelectionToolbarAction } from '@/components/FileList/SelectionToolbar'
import { TrashIcon, InformationCircleIcon, ArrowUturnRightIcon } from '@heroicons/react/24/outline'
import { useAlert } from '@/components/Alert'
import { useEmptyTrash } from '@/api/features/trash/trash.mutations'
import { useTrash } from '@/api/features/trash/trash.queries'
import { useQueryClient } from '@tanstack/react-query'

const formatFileSize = (bytes: number): string => {
  if (Number.isNaN(bytes) || bytes < 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(2)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(2)} MB`
  const gb = mb / 1024
  return `${gb.toFixed(2)} GB`
}

export default function TrashPage() {
  const { showAlert } = useAlert()
  const emptyTrashMutation = useEmptyTrash()
  const queryClient = useQueryClient()

  const trashQuery = useTrash()

  const files = React.useMemo<FileItem[]>(() => {
    if (!trashQuery.data) return []
    return trashQuery.data.items.map(item => ({
      id: item.id,
      name: item.title,
      type: item.type === 'folder' ? 'Folder' : (item.file_extension ?? 'file').toUpperCase(),
      modified: item.deleted_at,
      size: item.file_size != null ? formatFileSize(item.file_size) : undefined,
    }))
  }, [trashQuery.data])

  const [selectedItems, setSelectedItems] = React.useState<FileItem[]>([])
  const selectionActionRef = React.useRef<((action: SelectionToolbarAction, items: FileItem[]) => void) | null>(null)

  const handleEmptyTrash = () => {
    emptyTrashMutation.mutate(undefined, {
      onSuccess: () => {
        showAlert({
          type: 'success',
          heading: 'Trash emptied',
          message: 'All items in Trash have been deleted permanently.',
          duration: 4000,
        })
        queryClient.invalidateQueries({ queryKey: ['trash'] })
      },
      onError: () => {
        showAlert({
          type: 'error',
          heading: 'Empty Trash failed',
          message: 'Could not empty Trash. Please try again later.',
          duration: 4000,
        })
      },
    })
  }
  return (
    <div className="h-full flex flex-col gap-6">

      <header className="space-y-1">
        {selectedItems.length === 0 ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Trash</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Recently deleted files. After 30 days, they will be permanently removed from your account.
            </p>
          </>
        ) : (
          <div className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => selectionActionRef.current?.('restore', selectedItems)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowUturnRightIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Restore</span>
              </button>
              <button
                type="button"
                onClick={() => selectionActionRef.current?.('delete', selectedItems)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
              <button
                type="button"
                onClick={() => selectionActionRef.current?.('details', selectedItems)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <InformationCircleIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Details</span>
              </button>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {selectedItems.length} selected
              </span>
              <button
                type="button"
                onClick={() => setSelectedItems([])}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors text-sm"
              >
                Clear selection
              </button>
            </div>
          </div>
        )}
      </header>

      <section className="flex-1 min-h-0 flex flex-col">
        <FileList
          files={files}
          viewMode="details"
          tilesAlignLeft={true}
          className="flex-1 min-h-0"
          externalSelectionToolbar={true}
          onSelectionChange={setSelectedItems}
          actionRef={selectionActionRef}
          contextMenuMode="trash"
          toolbarRight={
            <>
              <span className="hidden sm:inline-block text-sm text-gray-500 dark:text-gray-400 mr-2">
                {files.length} items
              </span>
              <Button
                variant="danger"
                size="md"
                icon={<TrashIcon className="w-5 h-5 text-current" aria-hidden="true" />}
                value="Empty Trash"
                className="inline-flex items-center gap-2"
                aria-label="Empty Trash"
                onClick={handleEmptyTrash}
              />
            </>
          }
        />
      </section>
    </div>
  )
}

