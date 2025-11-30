import { ArrowUpTrayIcon, FolderIcon } from '@heroicons/react/24/outline'

export type UploadMenuProps = {
  onCreateFolder: () => void
  onUploadFiles: () => void
  menuRef: React.RefObject<HTMLDivElement | null>
}

export default function UploadMenu({ onCreateFolder, onUploadFiles, menuRef }: Readonly<UploadMenuProps>) {
  return (
    <div
      ref={menuRef}
      className="absolute top-full mt-2 right-0 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-50"
    >
      <button
        onClick={onCreateFolder}
        className="w-full flex items-center gap-3 text-left px-4 py-3 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
      >
        <FolderIcon className="w-5 h-5 flex-shrink-0" />
        <span>Create folder</span>
      </button>
      <button
        onClick={onUploadFiles}
        className="w-full flex items-center gap-3 text-left px-4 py-3 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
      >
        <ArrowUpTrayIcon className="w-5 h-5 flex-shrink-0" />
        <span>Upload files</span>
      </button>
    </div>
  )
}

