import Offcanvas from '@/components/Offcanvas/Offcanvas'
import Loading from '@/components/Loading/Loading'
import { FolderIcon, DocumentIcon, LinkIcon } from '@heroicons/react/24/outline'
import { usePublicLinkDetail } from '@/api/features/public-link/public-link.queries'
import { formatDateTime } from '../utils'
import { useState } from 'react'
import { useAlert } from '@/components/Alert/AlertProvider'

export type PublicLinkDetailOffcanvasProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  token: string | null
}

export default function PublicLinkDetailOffcanvas({
  open,
  onOpenChange,
  token,
}: Readonly<PublicLinkDetailOffcanvasProps>) {
  const { data: linkDetail, isLoading } = usePublicLinkDetail(token)
  const { showAlert } = useAlert()
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      showAlert({ type: 'success', message: 'Link copied to clipboard' })
    } catch {
      showAlert({ type: 'error', message: 'Failed to copy link' })
    }
  }

  return (
    <Offcanvas
      title={linkDetail?.shareable_name ?? 'Public Link Detail'}
      open={open}
      onOpenChange={onOpenChange}
      closeButton
      width="25"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loading size="lg" />
        </div>
      ) : linkDetail ? (
        <div className="space-y-6">
          <section className="space-y-2">
            <div className="w-full flex justify-center">
              <div className="w-32 h-32 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                {linkDetail.shareable_type === 'folder' ? (
                  <FolderIcon className="w-12 h-12 text-blue-500" />
                ) : (
                  <DocumentIcon className="w-12 h-12 text-gray-500" />
                )}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Link Information
            </h3>
            <dl className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500 dark:text-gray-400">Name</dt>
                <dd className="text-right font-medium truncate max-w-[180px]">
                  {linkDetail.shareable_name}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500 dark:text-gray-400">Type</dt>
                <dd className="text-right font-medium capitalize">{linkDetail.shareable_type}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500 dark:text-gray-400">Permission</dt>
                <dd className="text-right font-medium capitalize">{linkDetail.permission}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500 dark:text-gray-400">Created</dt>
                <dd className="text-right font-medium">{formatDateTime(linkDetail.created_at)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500 dark:text-gray-400">Expires</dt>
                <dd className="text-right font-medium">
                  {linkDetail.expired_at ? formatDateTime(linkDetail.expired_at) : 'Never'}
                </dd>
              </div>
              {linkDetail.revoked_at && (
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">Revoked</dt>
                  <dd className="text-right font-medium">{formatDateTime(linkDetail.revoked_at)}</dd>
                </div>
              )}
              {linkDetail.owner && (
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">Owner</dt>
                  <dd className="text-right font-medium truncate max-w-[180px]">
                    {linkDetail.owner.name}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {linkDetail.token && (
            <section>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Public Link
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/public/${linkDetail.token}`}
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200"
                />
                <button
                  type="button"
                  onClick={() => handleCopyLink(`${window.location.origin}/public/${linkDetail.token}`)}
                  className="px-3 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2"
                >
                  <LinkIcon className="w-4 h-4" />
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </section>
          )}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No details available</p>
      )}
    </Offcanvas>
  )
}

