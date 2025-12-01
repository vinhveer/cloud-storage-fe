import Offcanvas from '@/components/Offcanvas/Offcanvas'
import type { FileItem } from '@/components/FileList/types'
import type { FileDetail } from '@/api/features/file/file.types'
import { useFileDetailPanel } from './hooks/useFileDetailPanel'
import { useFileDetail } from '@/api/features/file/file.queries'

interface FileDetailPanelProps {
  file: FileItem | null
  fileDetail?: FileDetail | null
  open: boolean
  onClose: () => void
}

function formatFileSize(bytes: number): string {
  const sizeInKB = bytes / 1024
  const sizeInMB = sizeInKB / 1024
  const sizeInGB = sizeInMB / 1024
  if (sizeInGB >= 1) return `${sizeInGB.toFixed(2)} GB`
  if (sizeInMB >= 1) return `${sizeInMB.toFixed(2)} MB`
  return `${sizeInKB.toFixed(2)} KB`
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export default function FileDetailPanel({ file, fileDetail: externalFileDetail, open, onClose }: Readonly<FileDetailPanelProps>) {
  const { isFolder, ItemIcon } = useFileDetailPanel(file)

  const fileId = file?.id && !isFolder ? Number(file.id) : undefined
  const { data: fetchedFileDetail } = useFileDetail(fileId)

  const fileDetail = externalFileDetail ?? fetchedFileDetail ?? null

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
      closeButton={{ position: 'right' }}
    >
      <div className="space-y-6">
        {/* Icon and file name */}
        <section className="space-y-3">
          <div className="w-full flex flex-col items-center">
            <div className="w-24 h-24 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-300">
              <ItemIcon className="w-12 h-12" />
            </div>
            <h2 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white text-center break-words max-w-full px-2">
              {file.name}
            </h2>
          </div>
        </section>

        {/* File information */}
        <section>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            File Information
          </h3>
          <dl className="space-y-3 text-sm">
            {fileDetail && (
              <>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">Display Name</dt>
                  <dd className="text-right font-medium text-gray-900 dark:text-white break-words max-w-[60%] text-right">
                    {fileDetail.display_name}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">File Extension</dt>
                  <dd className="text-right font-medium text-gray-900 dark:text-white">{fileDetail.file_extension}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">MIME Type</dt>
                  <dd className="text-right font-medium text-gray-900 dark:text-white break-words max-w-[60%] text-right text-xs">
                    {fileDetail.mime_type}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">File Size</dt>
                  <dd className="text-right font-medium text-gray-900 dark:text-white">
                    {formatFileSize(fileDetail.file_size)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">Folder ID</dt>
                  <dd className="text-right font-medium text-gray-900 dark:text-white">
                    {fileDetail.folder_id ?? 'Root'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">Created At</dt>
                  <dd className="text-right font-medium text-gray-900 dark:text-white text-xs">
                    {formatDate(fileDetail.created_at)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">Last Opened At</dt>
                  <dd className="text-right font-medium text-gray-900 dark:text-white text-xs">
                    {formatDate(fileDetail.last_opened_at)}
                  </dd>
                </div>
              </>
            )}
            {!fileDetail && (
              <>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">Name</dt>
                  <dd className="text-right font-medium text-gray-900 dark:text-white truncate max-w-[180px]">
                    {file.name}
                  </dd>
                </div>
                {file.type && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500 dark:text-gray-400">Type</dt>
                    <dd className="text-right font-medium text-gray-900 dark:text-white">{file.type}</dd>
                  </div>
                )}
                {file.size && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500 dark:text-gray-400">Size</dt>
                    <dd className="text-right font-medium text-gray-900 dark:text-white">{file.size}</dd>
                  </div>
                )}
                {file.modified && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500 dark:text-gray-400">Modified</dt>
                    <dd className="text-right font-medium text-gray-900 dark:text-white">{file.modified}</dd>
                  </div>
                )}
              </>
            )}
          </dl>
        </section>
      </div>
    </Offcanvas>
  )
}

