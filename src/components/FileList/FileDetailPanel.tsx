import React from 'react'
import { DocumentIcon, PhotoIcon, FilmIcon, MusicalNoteIcon, FolderIcon } from '@heroicons/react/24/outline'
import Offcanvas from '@/components/Offcanvas/Offcanvas'
import type { FileItem } from '@/components/FileList/types'
import { useFilePreview } from '@/api/features/file/file.queries'

interface FileDetailPanelProps {
  file: FileItem | null
  open: boolean
  onClose: () => void
}

export default function FileDetailPanel({ file, open, onClose }: Readonly<FileDetailPanelProps>) {
  const isFolder = (file?.type ?? '').toLowerCase() === 'folder'
  const fileId = !isFolder && file?.id ? Number(file.id) : undefined

  // Fetch preview URL for files (not folders)
  const { data: previewData, isLoading: isLoadingPreview } = useFilePreview(fileId)

  // Track image load state
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)

  // Reset image state when file changes
  React.useEffect(() => {
    setImageLoaded(false)
    setImageError(false)
  }, [file?.id])

  const ItemIcon = React.useMemo(() => {
    if (isFolder) return FolderIcon
    const name = file?.name?.toLowerCase() ?? ''
    if (name.match(/\.(png|jpe?g|gif|webp|bmp|svg)$/)) return PhotoIcon
    if (name.match(/\.(mp4|mov|avi|mkv|webm)$/)) return FilmIcon
    if (name.match(/\.(mp3|wav|flac|aac)$/)) return MusicalNoteIcon
    return DocumentIcon
  }, [file?.name, isFolder])

  // Determine if we should show icon or image
  const showIcon = isFolder || (!isLoadingPreview && (!previewData?.preview_url || imageError))
  const showImage = !isFolder && previewData?.preview_url && !imageError

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
            <div className="w-40 h-40 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-4xl font-semibold text-gray-500 dark:text-gray-300 overflow-hidden relative">
              {/* Loading skeleton */}
              {isLoadingPreview && !isFolder && (
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 w-full h-full absolute inset-0" />
              )}

              {/* Image preview */}
              {showImage && (
                <img
                  src={previewData.preview_url}
                  alt={file.name}
                  className={`w-full h-full object-cover absolute inset-0 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              )}

              {/* Fallback icon */}
              {showIcon && <ItemIcon className="w-16 h-16" />}
            </div>
          </div>
        </section>

        {/* Item information */}
        <section>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            {isFolder ? 'Folder information' : 'File information'}
          </h3>
          <dl className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500 dark:text-gray-400">Name</dt>
              <dd className="text-right font-medium truncate max-w-[180px]">{file.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500 dark:text-gray-400">Type</dt>
              <dd className="text-right font-medium">{file.type ?? 'Unknown'}</dd>
            </div>
            {!isFolder && file.size && (
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500 dark:text-gray-400">Size</dt>
                <dd className="text-right font-medium">{file.size}</dd>
              </div>
            )}
            {isFolder && file.itemsCount !== undefined && (
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500 dark:text-gray-400">Items</dt>
                <dd className="text-right font-medium">{file.itemsCount} item{file.itemsCount !== 1 ? 's' : ''}</dd>
              </div>
            )}
            {file.modified && (
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500 dark:text-gray-400">{isFolder ? 'Created' : 'Modified'}</dt>
                <dd className="text-right font-medium">{file.modified}</dd>
              </div>
            )}
          </dl>
        </section>
      </div>
    </Offcanvas>
  )
}
