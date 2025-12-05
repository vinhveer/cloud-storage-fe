import Offcanvas from '@/components/Offcanvas/Offcanvas'
import Loading from '@/components/Loading/Loading'
import { FolderIcon, DocumentIcon } from '@heroicons/react/24/outline'
import type { ShareDetail } from '@/api/features/share/share.types'

export type ShareDetailsOffcanvasProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  shareDetail: ShareDetail | undefined
  isLoading: boolean
}

export default function ShareDetailsOffcanvas({
  open,
  onOpenChange,
  shareDetail,
  isLoading,
}: Readonly<ShareDetailsOffcanvasProps>) {
  return (
    <Offcanvas
      title={shareDetail?.shareable_name ?? 'Details'}
      open={open}
      onOpenChange={onOpenChange}
      closeButton
      width="25"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loading size="lg" />
        </div>
      ) : shareDetail ? (
        <div className="space-y-6">
          <section className="space-y-2">
            <div className="w-full flex justify-center">
              <div className="w-32 h-32 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-4xl font-semibold text-gray-500 dark:text-gray-300">
                {shareDetail.shareable_type === 'folder' ? (
                  <FolderIcon className="w-12 h-12" />
                ) : (
                  <DocumentIcon className="w-12 h-12" />
                )}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              {shareDetail.shareable_type === 'folder' ? 'Folder information' : 'File information'}
            </h3>
            <dl className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500 dark:text-gray-400">Name</dt>
                <dd className="text-right font-medium truncate max-w-[180px]">
                  {shareDetail.shareable_name}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500 dark:text-gray-400">Type</dt>
                <dd className="text-right font-medium capitalize">{shareDetail.shareable_type}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500 dark:text-gray-400">Shared on</dt>
                <dd className="text-right font-medium">
                  {new Date(shareDetail.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500 dark:text-gray-400">Shared by</dt>
                <dd className="text-right font-medium truncate max-w-[180px]">
                  {shareDetail.shared_by.name}
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              People with access
            </h3>
            {shareDetail.shared_with.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm py-4 text-center">
                Only you have access
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {shareDetail.shared_with.map((user) => (
                  <div
                    key={user.user_id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No details available</p>
      )}
    </Offcanvas>
  )
}

