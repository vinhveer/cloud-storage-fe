import clsx from 'clsx'
import type { FileItem } from '@/components/FileList'
import { CheckIcon, FileIcon, FolderOpenIconLarge } from '@data/icons/icons'

type TilesViewProps = Readonly<{
  files: FileItem[]
  selectionMode: boolean
  isSelected: (index: number) => boolean
  toggleItem: (index: number) => void
}>

export default function TilesView({ files, selectionMode, isSelected, toggleItem }: Readonly<TilesViewProps>) {
  return (
    <div className="p-6">
      {files.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-500 dark:text-gray-400">
          <FolderOpenIconLarge />
          <p>No files found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <button
              key={file.id ?? index}
              onClick={() => selectionMode && toggleItem(index)}
              aria-pressed={selectionMode ? isSelected(index) : undefined}
              className={clsx('relative flex items-center p-4 border-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer', selectionMode && isSelected(index) ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500' : 'bg-gray-50 dark:bg-gray-900 border-transparent')}
            >
              {selectionMode && (
                <div className="absolute top-2 left-2">
                  <div className={clsx('w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200', isSelected(index) ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700')}>
                    {isSelected(index) && <CheckIcon className="text-white w-3 h-3" />}
                  </div>
                </div>
              )}
              <div className="flex-shrink-0 mr-4">{file.icon ?? <FileIcon className="text-blue-600 w-7 h-7" />}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{file.name ?? 'Unknown'}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{file.type ?? 'File'}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500">{file.modified ?? 'Unknown'}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}


