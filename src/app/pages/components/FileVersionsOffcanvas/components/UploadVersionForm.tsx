import { Button } from '@/components/Button/Button'
import Loading from '@/components/Loading/Loading'
import { formatFileSize } from '../utils'

interface UploadVersionFormProps {
  uploadAction: string
  uploadNotes: string
  uploadFile: File | null
  uploadProgress: number
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onActionChange: (action: string) => void
  onNotesChange: (notes: string) => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onUpload: () => void
  onCancel: () => void
}

export default function UploadVersionForm({
  uploadAction,
  uploadNotes,
  uploadFile,
  uploadProgress,
  fileInputRef,
  onActionChange,
  onNotesChange,
  onFileChange,
  onUpload,
  onCancel,
}: UploadVersionFormProps) {
  return (
    <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
        Upload New Version
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Action
          </label>
          <select
            value={uploadAction}
            onChange={(e) => onActionChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="update">Update</option>
            <option value="upload">Upload</option>
            <option value="revision">Revision</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={uploadNotes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add notes about this version..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            File
          </label>
          <input
            ref={fileInputRef}
            type="file"
            onChange={onFileChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {uploadFile && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Selected: {uploadFile.name} ({formatFileSize(uploadFile.size)})
            </p>
          )}
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={onUpload}
            disabled={!uploadFile || (uploadProgress > 0 && uploadProgress < 100)}
          >
            {uploadProgress > 0 && uploadProgress < 100 ? (
              <>
                <Loading size="sm" className="mr-2" />
                Uploading...
              </>
            ) : (
              'Upload Version'
            )}
          </Button>
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

