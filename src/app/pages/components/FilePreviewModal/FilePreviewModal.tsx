import { XMarkIcon } from '@heroicons/react/24/outline'
import { useFilePreview } from '@/api/features/file/file.queries'
import Loading from '@/components/Loading/Loading'

interface FilePreviewModalProps {
  fileId: number | null
  fileName?: string
  open: boolean
  onClose: () => void
}

export default function FilePreviewModal({ fileId, fileName, open, onClose }: FilePreviewModalProps) {
  const { data: previewData, isLoading, error } = useFilePreview(fileId ?? undefined)

  if (!open || !fileId) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative w-full max-w-6xl bg-white dark:bg-gray-900 rounded-lg shadow-xl flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate flex-1 mr-4">
              {fileName || 'File Preview'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 flex-shrink-0"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loading size="lg" />
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  Error loading preview: {error.message}
                </p>
              </div>
            )}

            {previewData?.preview_url && !isLoading && (
              <div className="w-full h-full min-h-[400px]">
                <iframe
                  src={previewData.preview_url}
                  className="w-full h-full min-h-[400px] border border-gray-200 dark:border-gray-700 rounded-lg"
                  title={fileName || 'File preview'}
                  allowFullScreen
                />
                {previewData.expires_in && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                    Preview expires in {Math.floor(previewData.expires_in / 60)} minutes
                  </p>
                )}
              </div>
            )}

            {previewData && !previewData.preview_url && !isLoading && (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Preview not available for this file type
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

