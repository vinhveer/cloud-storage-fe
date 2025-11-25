import React from 'react'
import { DocumentIcon, PhotoIcon, FilmIcon, MusicalNoteIcon } from '@heroicons/react/24/outline'
import type { FileItem } from '@/components/FileList/types'

interface FileDetailPanelProps {
  file: FileItem | null
  open: boolean
  onClose: () => void
}

export default function FileDetailPanel({ file, open, onClose }: Readonly<FileDetailPanelProps>) {
  if (!open || !file) return null

  const FileIcon = React.useMemo(() => {
    const name = file.name?.toLowerCase() ?? ''
    if (name.match(/\.(png|jpe?g|gif|webp|bmp|svg)$/)) return PhotoIcon
    if (name.match(/\.(mp4|mov|avi|mkv|webm)$/)) return FilmIcon
    if (name.match(/\.(mp3|wav|flac|aac)$/)) return MusicalNoteIcon
    return DocumentIcon
  }, [file.name])

  return (
    <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl border-l border-gray-200 dark:border-gray-800 z-40 flex flex-col">
      <header className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-100 truncate">{file.name}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Details</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none"
          aria-label="Close details"
        >
          ×
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        {/* Preview area */}
        <section className="space-y-2">
          <div className="w-full flex justify-center">
            <div className="w-40 h-40 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-4xl font-semibold text-gray-500 dark:text-gray-300 overflow-hidden">
              <FileIcon className="w-16 h-16" />
            </div>
          </div>
        </section>

        {/* File information */}
        <section>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            File information
          </h3>
          <dl className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500 dark:text-gray-400">Type</dt>
              <dd className="text-right font-medium">{file.type ?? 'Unknown'}</dd>
            </div>
            {file.size && (
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500 dark:text-gray-400">Size</dt>
                <dd className="text-right font-medium">{file.size}</dd>
              </div>
            )}
            {file.modified && (
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500 dark:text-gray-400">Modified</dt>
                <dd className="text-right font-medium">{file.modified}</dd>
              </div>
            )}
          </dl>
        </section>
      </div>
    </aside>
  )
}
