import clsx from 'clsx'
import { CheckIcon, FolderOpenIcon } from '@heroicons/react/24/outline'
import type { FileListViewProps } from '@/components/FileList/views/types'
import { getDefaultFileIcon } from '@/components/FileList/file-list.icons'

export default function GridView({ files, selectionMode, isSelected, toggleItem, onItemOpen, onItemContext }: FileListViewProps) {
  return (
    <div className="p-6">
      {files.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-500 dark:text-gray-400">
          <FolderOpenIcon />
          <p>No files found</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
          {files.map((file, index) => (
            <button
              key={file.id ?? index}
              onClick={() => {
                if (selectionMode) {
                  toggleItem(index)
                } else {
                  onItemOpen?.(file, index)
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault()
                onItemContext?.(file, index, e.clientX, e.clientY, e.currentTarget as HTMLElement)
              }}
              type="button"
              aria-pressed={selectionMode ? isSelected(index) : undefined}
              className={clsx('relative flex flex-col items-center p-3 rounded-lg border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer', selectionMode && isSelected(index) ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500' : 'bg-white dark:bg-gray-900 border-transparent')}
            >
              {selectionMode && (
                <div className="absolute top-1 right-1">
                  <div className={clsx('w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200', isSelected(index) ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700')}>
                    {isSelected(index) && <CheckIcon className="text-white w-3 h-3" />}
                  </div>
                </div>
              )}

              <div className="mb-2">
                {file.icon ?? getDefaultFileIcon(file, 'w-15 h-15')}
              </div>
              <div className="text-center w-full">
                <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate" title={file.name ?? 'Unknown'}>
                  {file.name ?? 'Unknown'}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}


