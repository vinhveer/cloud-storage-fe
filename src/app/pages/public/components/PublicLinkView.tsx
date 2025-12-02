import { useState } from 'react'
import { ArrowDownTrayIcon, DocumentIcon, FolderIcon } from '@heroicons/react/24/outline'
import { getPublicLinkDownload } from '@/api/features/public-link/public-link.api'
import { useAlert } from '@/components/Alert/AlertProvider'
import type { PublicLinkDetail } from '@/api/features/public-link/public-link.types'

interface PublicLinkViewProps {
  data: PublicLinkDetail
  token: string
}

export default function PublicLinkView({ data, token }: PublicLinkViewProps) {
  const { showAlert } = useAlert()
  const [downloadLoading, setDownloadLoading] = useState(false)

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
        <div className="flex items-center gap-4">
          {isFile ? (
            <DocumentIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          ) : (
            <FolderIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white break-words">
              {data.shareable_name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isFile ? 'File' : 'Folder'}
            </p>
          </div>
        </div>

        {isFile && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloadLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              {downloadLoading ? 'Downloading...' : 'Download'}
            </button>
          </div>
        )}

        {!isFile && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Folder preview is not available. Please download individual files.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

