import clsx from 'clsx'
import { CheckIcon, FolderOpenIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import type { FileListViewProps } from '@/components/FileList/views/types'
import { getDefaultFileIcon } from '@/components/FileList/file-list.icons'

export default function DetailsView({ files, selectionMode, isSelected, toggleItem, onItemOpen, onItemClick, onItemContext, highlightedIndex, hideContextMenu = false }: FileListViewProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 mt-0">
        <thead className="bg-gray-0 dark:bg-gray-800">
          <tr>
            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <div className="flex items-center">
                {selectionMode && <div className="w-5 mr-2 sm:mr-3 flex-shrink-0" />}
                <div className="w-8 sm:w-10 mr-2 sm:mr-3 flex-shrink-0" />
                Name
              </div>
            </th>
            <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
            <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Modified</th>
            <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
            {!hideContextMenu && <th className="px-2 sm:px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10"></th>}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {files.length === 0 && (
            <tr>
              <td colSpan={hideContextMenu ? 4 : 5} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                <FolderOpenIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">No files found</p>
              </td>
            </tr>
          )}
          {files.map((file, index) => (
            <tr
              key={file.id ?? index}
              onClick={() => {
                if (selectionMode) {
                  toggleItem(index)
                } else {
                  // Single click: only highlight the row
                  onItemClick?.(file, index)
                }
              }}
              onDoubleClick={() => {
                if (!selectionMode) {
                  // Double click: open the file/folder
                  onItemOpen?.(file, index)
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault()
                onItemContext?.(file, index, e.clientX, e.clientY, e.currentTarget as HTMLElement)
              }}
              className={clsx(
                'group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer',
                selectionMode && isSelected(index) && 'bg-blue-50 dark:bg-blue-900/30',
                !selectionMode && highlightedIndex === index && 'bg-blue-50 dark:bg-blue-900/30'
              )}
            >
              <td className="px-3 sm:px-6 py-4">
                <div className="flex items-center min-w-0">
                  {selectionMode && (
                    <div className="mr-2 sm:mr-3 flex-shrink-0">
                      <div className={clsx('w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200', isSelected(index) ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700')}>
                        {isSelected(index) && <CheckIcon className="text-white w-3 h-3" />}
                      </div>
                    </div>
                  )}
                  <div className="flex-shrink-0 mr-2 sm:mr-3">
                    {file.icon ?? getDefaultFileIcon(file, 'w-8 h-8 sm:w-10 sm:h-10')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{file.name ?? 'Unknown'}</div>
                    <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {file.type ?? 'File'}
                      {(file.modified || file.size) && ' • '}
                      {file.modified && <span className="hidden sm:inline">{file.modified}</span>}
                      {file.size && file.type?.toLowerCase() !== 'folder' && <span className="lg:hidden">{file.size}</span>}
                      {file.type?.toLowerCase() === 'folder' && typeof file.itemsCount === 'number' && (
                        <span className="lg:hidden">{file.itemsCount} {file.itemsCount === 1 ? 'item' : 'items'}</span>
                      )}
                    </div>
                  </div>
                </div>
              </td>
              <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{file.type ?? 'File'}</td>
              <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{file.modified ?? 'Unknown'}</td>
              <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {file.type?.toLowerCase() === 'folder'
                  ? typeof file.itemsCount === 'number'
                    ? `${file.itemsCount} ${file.itemsCount === 1 ? 'item' : 'items'}`
                    : '-'
                  : file.size ?? 'Unknown'}
              </td>
              {!hideContextMenu && (
                <td className="px-2 sm:px-3 py-4 whitespace-nowrap text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      const btn = e.currentTarget as HTMLButtonElement
                      const rect = btn.getBoundingClientRect()
                      onItemContext?.(file, index, rect.right, rect.bottom, btn)
                    }}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
                    aria-label="More actions"
                  >
                    <EllipsisVerticalIcon className="w-5 h-5" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}