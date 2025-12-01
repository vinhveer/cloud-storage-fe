import { XMarkIcon } from '@heroicons/react/24/outline'
import CreateShareTab from './tabs/CreateShareTab'
import ShareDetailTab from './tabs/ShareDetailTab'

export type ShareModalProps = {
  open: boolean
  onClose: () => void
  initialShareId?: number
  initialCreateType?: 'file' | 'folder'
  initialCreateId?: number
  initialCreateName?: string
}

export default function ShareModal({
  open,
  onClose,
  initialShareId,
  initialCreateType,
  initialCreateId,
  initialCreateName,
}: Readonly<ShareModalProps>) {
  if (!open) return null

  const showDetail = initialShareId !== undefined

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative w-full h-full max-w-6xl bg-white dark:bg-gray-900 rounded-lg shadow-xl flex flex-col max-h-[95vh]">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {showDetail ? 'Share Detail' : 'Share'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            {showDetail && initialShareId ? (
              <ShareDetailTab shareId={initialShareId} onBack={onClose} />
            ) : (
              <CreateShareTab
                initialType={initialCreateType}
                initialId={initialCreateId}
                initialName={initialCreateName}
                onSuccess={onClose}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
