import React from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import UploadButton from '@/app/layout/components/Navbar/UploadButton/UploadButton'
import clsx from 'clsx'

export type MyFilesToolbarProps = {
  searchQuery: string
  onSearchChange: (query: string) => void
  currentFolderId: number | null
  className?: string
}

export default function MyFilesToolbar({
  searchQuery,
  onSearchChange,
  currentFolderId,
  className,
}: Readonly<MyFilesToolbarProps>) {
  const [localQuery, setLocalQuery] = React.useState(searchQuery)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [localQuery, onSearchChange])

  React.useEffect(() => {
    setLocalQuery(searchQuery)
  }, [searchQuery])

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div className="relative flex-1 max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500">
          <MagnifyingGlassIcon className="w-5 h-5" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search files and folders..."
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        {localQuery && (
          <button
            type="button"
            onClick={() => setLocalQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
      </div>
      <UploadButton currentFolderId={currentFolderId} />
    </div>
  )
}

