import { useState } from 'react'
import { 
  ArrowDownTrayIcon, 
  DocumentIcon, 
  FolderIcon, 
  UserCircleIcon,
  EyeIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'
import { getPublicLinkDownload } from '@/api/features/public-link/public-link.api'
import { usePublicLinkPreview } from '@/api/features/public-link/public-link.queries'
import { useAlert } from '@/components/Alert/AlertProvider'
import type { PublicLinkDetail } from '@/api/features/public-link/public-link.types'

interface PublicLinkViewProps {
  data: PublicLinkDetail
  token: string
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

function getFileTypeLabel(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'Image'
  if (mimeType.startsWith('video/')) return 'Video'
  if (mimeType.startsWith('audio/')) return 'Audio'
  if (mimeType.includes('pdf')) return 'PDF Document'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'Word Document'
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'Spreadsheet'
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'Presentation'
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) return 'Archive'
  if (mimeType.startsWith('text/')) return 'Text File'
  return 'File'
}

export default function PublicLinkView({ data, token }: PublicLinkViewProps) {
  const { showAlert } = useAlert()
  const [downloadLoading, setDownloadLoading] = useState(false)
  
  // Fetch preview data for additional file info
  const { data: previewData } = usePublicLinkPreview(data.shareable_type === 'file' ? token : null)

  const handleDownload = async () => {
    try {
      setDownloadLoading(true)
      const downloadData = await getPublicLinkDownload(token)
      const a = document.createElement('a')
      a.href = downloadData.download_url
      a.download = data.shareable_name
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      showAlert({ type: 'success', message: 'Download started.' })
    } catch {
      showAlert({ type: 'error', message: 'Failed to download file. Please try again.' })
    } finally {
      setDownloadLoading(false)
    }
  }

  const isFile = data.shareable_type === 'file'
  const canDownload = data.permission === 'download' || data.permission === 'edit'
  const fileInfo = previewData?.file

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
          <div className="flex items-center gap-2 text-blue-100 text-sm mb-2">
            <GlobeAltIcon className="w-4 h-4" />
            <span>Shared publicly</span>
          </div>
          <h1 className="text-2xl font-semibold text-white break-words">
            {data.shareable_name}
          </h1>
        </div>

        <div className="p-8 space-y-6">
          {/* File/Folder info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
              {isFile ? (
                <DocumentIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              ) : (
                <FolderIcon className="w-8 h-8 text-blue-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded capitalize">
                  {isFile ? (fileInfo ? getFileTypeLabel(fileInfo.mime_type) : 'File') : 'Folder'}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded capitalize flex items-center gap-1">
                  <EyeIcon className="w-3 h-3" />
                  {data.permission === 'view' ? 'View only' : data.permission === 'download' ? 'Can download' : data.permission}
                </span>
              </div>
              
              {/* File details from preview */}
              {fileInfo && (
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <p>Size: {formatFileSize(fileInfo.size)}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                    Type: {fileInfo.mime_type}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Owner info */}
          {data.owner && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <UserCircleIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Shared by</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {data.owner.name}
                </p>
              </div>
            </div>
          )}

          {/* Download button for files */}
          {isFile && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              {canDownload ? (
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloadLoading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  {downloadLoading ? 'Downloading...' : 'Download'}
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    This file is shared for viewing only.
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Contact the owner if you need download access.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Folder message */}
          {!isFile && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <FolderIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Folder preview is not available.
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Please download individual files from within the folder.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            This is a public link. Anyone with this link can access this {isFile ? 'file' : 'folder'}.
          </p>
        </div>
      </div>
    </div>
  )
}

