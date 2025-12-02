import { PlusIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'

interface UploadMenuButtonProps {
  uploadMenuOpen: boolean
  uploadButtonRef: React.RefObject<HTMLDivElement | null>
  uploadMenuRef: React.RefObject<HTMLDivElement | null>
  onToggleMenu: () => void
  onUploadClick: () => void
}

export default function UploadMenuButton({
  uploadMenuOpen,
  uploadButtonRef,
  uploadMenuRef,
  onToggleMenu,
  onUploadClick,
}: UploadMenuButtonProps) {
  return (
    <div className="relative" ref={uploadButtonRef}>
      <button
        type="button"
        className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
        aria-label="Upload new version"
        onClick={onToggleMenu}
      >
        <PlusIcon className="w-6 h-6" />
      </button>
      {uploadMenuOpen && (
        <div
          ref={uploadMenuRef}
          className="absolute top-full mt-2 right-0 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-50"
        >
          <button
            onClick={onUploadClick}
            className="w-full flex items-center gap-3 text-left px-4 py-3 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
          >
            <ArrowUpTrayIcon className="w-5 h-5 flex-shrink-0" />
            <span>Upload New Version</span>
          </button>
        </div>
      )}
    </div>
  )
}

