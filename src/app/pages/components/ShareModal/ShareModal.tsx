import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useListShares } from '@/api/features/share/share.queries'
import { usePublicLinks } from '@/api/features/public-link/public-link.queries'
import ShareTab from './components/ShareTab'
import PublicLinkTab from './components/PublicLinkTab'

interface ShareModalProps {
  open: boolean
  onClose: () => void
  initialShareableType?: 'file' | 'folder'
  initialShareableId?: number
  initialShareableName?: string
}

export default function ShareModal({
  open,
  onClose,
  initialShareableType,
  initialShareableId,
  initialShareableName,
}: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<'share' | 'public-link'>('share')
  const { refetch: refetchShares } = useListShares({ page: 1, per_page: 10 })
  const { refetch: refetchPublicLinks } = usePublicLinks({ page: 1, per_page: 10 })

  useEffect(() => {
    if (!open) {
      setActiveTab('share')
    }
  }, [open])

  useEffect(() => {
    if (open) {
      refetchShares()
      refetchPublicLinks()
    }
  }, [open, refetchShares, refetchPublicLinks])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-lg shadow-xl flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Share & Public Links
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-4">
            <nav className="flex space-x-8" aria-label="Tabs">
              <button
                type="button"
                onClick={() => setActiveTab('share')}
                className={`
                  whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors
                  ${activeTab === 'share'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                Share
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('public-link')}
                className={`
                  whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors
                  ${activeTab === 'public-link'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                Public Link
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {activeTab === 'share' ? (
              <ShareTab
                initialShareableType={initialShareableType}
                initialShareableId={initialShareableId}
                initialShareableName={initialShareableName}
              />
            ) : (
              <PublicLinkTab
                initialShareableType={initialShareableType}
                initialShareableId={initialShareableId}
                initialShareableName={initialShareableName}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

