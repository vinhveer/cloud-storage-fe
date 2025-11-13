import clsx from 'clsx'
import type { FileItem } from '@/components/FileList'
import { CheckIcon, DocumentIcon, FolderOpenIcon } from '@heroicons/react/24/outline'

type ListViewProps = Readonly<{
  files: FileItem[]
  selectionMode: boolean
  isSelected: (index: number) => boolean
  toggleItem: (index: number) => void
}>

export default function ListView({ files, selectionMode, isSelected, toggleItem }: Readonly<ListViewProps>) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 mt-0 ">
      <thead className="bg-gray-0 dark:bg-gray-800">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Modified</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        {files.length === 0 && (
          <tr>
            <td colSpan={3} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
              <FolderOpenIcon />
              <p>No files found</p>
            </td>
          </tr>
        )}
        {files.map((file, index) => (
          <tr
            key={file.id ?? index}
            onClick={() => selectionMode && toggleItem(index)}
            className={clsx('hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer', selectionMode && isSelected(index) && 'bg-blue-50 dark:bg-blue-900/30')}
          >
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                {selectionMode && (
                  <div className="mr-3">
                    <div className={clsx('w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200', isSelected(index) ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700')}>
                      {isSelected(index) && <CheckIcon className="text-white w-3 h-3" />}
                    </div>
                  </div>
                )}

                <div className="flex-shrink-0 mr-5">
                  {file.icon ?? <DocumentIcon className="text-blue-600 w-8 h-8" />}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{file.name ?? 'Unknown'}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{file.type ?? 'File'}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{file.modified ?? 'Unknown'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{file.size ?? 'Unknown'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}


