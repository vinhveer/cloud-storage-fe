import clsx from 'clsx'
import { CheckIcon, FolderOpenIcon } from '@heroicons/react/24/outline'
import type { FileListViewProps } from '@/components/FileList/views/types'
import { getDefaultFileIcon } from '@/components/FileList/file-list.icons'

export default function TilesView({ files, selectionMode, isSelected, toggleItem, onItemOpen, onItemClick, onItemContext, tilesAlignLeft, highlightedIndex }: FileListViewProps) {
  return (
    <div className="p-6">
      {files.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-500 dark:text-gray-400">
          <FolderOpenIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">No files found</p>
        </div>
      ) : (
        // If tilesAlignLeft is true, use a flex-wrap layout so items hug the left edge
        (tilesAlignLeft ? (
          <div className="flex flex-wrap gap-4">
            {files.map((file, index) => (
              <div key={file.id ?? index} className="w-full sm:w-1/2 lg:w-1/3">
                <button
                  onClick={() => {
                    if (selectionMode) {
                      toggleItem(index)
                    } else {
                      onItemClick?.(file, index)
                    }
                  }}
                  onDoubleClick={() => {
                    if (!selectionMode) {
                      onItemOpen?.(file, index)
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    onItemContext?.(file, index, e.clientX, e.clientY, e.currentTarget as HTMLElement)
                  }}
                  aria-pressed={selectionMode ? isSelected(index) : undefined}
                  className={clsx(
                    'relative flex items-center justify-start p-4 border-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer w-full',
                    selectionMode && isSelected(index) ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500' : 'bg-gray-50 dark:bg-gray-900 border-transparent',
                    !selectionMode && highlightedIndex === index && 'bg-blue-50 dark:bg-blue-900/30 border-blue-500'
                  )}
                >
                  {selectionMode && (
                    <div className="absolute top-2 left-2">
                      <div className={clsx('w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200', isSelected(index) ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700')}>
                        {isSelected(index) && <CheckIcon className="text-white w-3 h-3" />}
                      </div>
                    </div>
                  )}
                  <div className="flex-shrink-0 mr-4">
                    {file.icon ?? getDefaultFileIcon(file, 'w-10 h-10')}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{file.name ?? 'Unknown'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{file.type ?? 'File'}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{file.modified ?? 'Unknown'}</div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <button
                key={file.id ?? index}
                onClick={() => {
                  if (selectionMode) {
                    toggleItem(index)
                  } else {
                    onItemClick?.(file, index)
                  }
                }}
                onDoubleClick={() => {
                  if (!selectionMode) {
                    onItemOpen?.(file, index)
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault()
                  onItemContext?.(file, index, e.clientX, e.clientY, e.currentTarget as HTMLElement)
                }}
                aria-pressed={selectionMode ? isSelected(index) : undefined}
                className={clsx(
                  'relative flex items-center justify-start p-4 border-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer',
                  selectionMode && isSelected(index) ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500' : 'bg-gray-50 dark:bg-gray-900 border-transparent',
                  !selectionMode && highlightedIndex === index && 'bg-blue-50 dark:bg-blue-900/30 border-blue-500'
                )}
              >
                {selectionMode && (
                  <div className="absolute top-2 left-2">
                    <div className={clsx('w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200', isSelected(index) ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700')}>
                      {isSelected(index) && <CheckIcon className="text-white w-3 h-3" />}
                    </div>
                  </div>
                )}
                <div className="flex-shrink-0 mr-4">
                  {file.icon ?? getDefaultFileIcon(file, 'w-10 h-10')}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{file.name ?? 'Unknown'}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{file.type ?? 'File'}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">{file.modified ?? 'Unknown'}</div>
                </div>
              </button>
            ))}
          </div>
        ))
      )}
    </div>
  )
}


