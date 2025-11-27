import React from 'react'
import { DocumentIcon, PhotoIcon, FilmIcon, MusicalNoteIcon } from '@heroicons/react/24/outline'
import Offcanvas from '@/components/Offcanvas/Offcanvas'
import type { FileItem } from '@/components/FileList/types'

interface FileDetailPanelProps {
  file: FileItem | null
  open: boolean
  onClose: () => void
}

export default function FileDetailPanel({ file, open, onClose }: Readonly<FileDetailPanelProps>) {
  const FileIcon = React.useMemo(() => {
    const name = file?.name?.toLowerCase() ?? ''
    if (name.match(/\.(png|jpe?g|gif|webp|bmp|svg)$/)) return PhotoIcon
    if (name.match(/\.(mp4|mov|avi|mkv|webm)$/)) return FilmIcon
    if (name.match(/\.(mp3|wav|flac|aac)$/)) return MusicalNoteIcon
    return DocumentIcon
  }, [file?.name])

  if (!file) return null

  return (
    <Offcanvas
      id="file-detail-panel"
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
      width="25"
      alignment="right"
      title={file.name}
      closeButton={{ position: 'right' }}
    >
      <div className="space-y-6">
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
          <dl className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
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
    </Offcanvas>
  )
}
