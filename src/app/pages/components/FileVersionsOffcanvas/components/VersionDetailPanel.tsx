import { XMarkIcon } from '@heroicons/react/24/outline'
import Loading from '@/components/Loading/Loading'
import { formatFileSize, formatDateTime } from '../utils'

interface VersionDetailPanelProps {
  open: boolean
  versionDetail: {
    version_number: number
    action: string
    file_size: number
    file_extension: string
    mime_type: string
    created_at: string
    notes?: string | null
    uploaded_by?: {
      name: string
    } | null
  } | null | undefined
  isLoading: boolean
  onClose: () => void
}

export default function VersionDetailPanel({
  open,
  versionDetail,
  isLoading,
  onClose,
}: VersionDetailPanelProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Version Detail
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loading size="lg" />
            </div>
          ) : versionDetail ? (
            <div className="space-y-4">
              <section>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Version Information
                </h4>
                <dl className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500 dark:text-gray-400">Version Number</dt>
                    <dd className="text-right font-medium">{versionDetail.version_number}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500 dark:text-gray-400">Action</dt>
                    <dd className="text-right font-medium capitalize">{versionDetail.action}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500 dark:text-gray-400">File Size</dt>
                    <dd className="text-right font-medium">{formatFileSize(versionDetail.file_size)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500 dark:text-gray-400">File Extension</dt>
                    <dd className="text-right font-medium">{versionDetail.file_extension}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500 dark:text-gray-400">MIME Type</dt>
                    <dd className="text-right font-medium">{versionDetail.mime_type}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500 dark:text-gray-400">Created At</dt>
                    <dd className="text-right font-medium">
                      {formatDateTime(versionDetail.created_at)}
                    </dd>
                  </div>
                  {versionDetail.notes && (
                    <div className="flex flex-col gap-2">
                      <dt className="text-gray-500 dark:text-gray-400">Notes</dt>
                      <dd className="text-sm text-gray-700 dark:text-gray-200 break-words">
                        {versionDetail.notes}
                      </dd>
                    </div>
                  )}
                  {versionDetail.uploaded_by && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500 dark:text-gray-400">Uploaded By</dt>
                      <dd className="text-right font-medium">{versionDetail.uploaded_by.name}</dd>
                    </div>
                  )}
                </dl>
              </section>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No details available</p>
          )}
        </div>
      </div>
    </div>
  )
}

