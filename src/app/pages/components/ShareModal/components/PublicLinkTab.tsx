import { useState, useCallback } from 'react'
import {
  LinkIcon,
  PlusIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  DocumentIcon,
  FolderIcon,
} from '@heroicons/react/24/outline'
import { usePublicLinks } from '@/api/features/public-link/public-link.queries'
import { useRevokePublicLink } from '@/api/features/public-link/public-link.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'
import Loading from '@/components/Loading/Loading'
import CreatePublicLinkForm from './CreatePublicLinkForm'
import { env } from '@/api/config/env'
import type { PublicLinkListItem } from '@/api/features/public-link/public-link.types'

interface PublicLinkTabProps {
  initialShareableType?: 'file' | 'folder'
  initialShareableId?: number
  initialShareableName?: string
  onRefresh: () => void
}

export default function PublicLinkTab({
  initialShareableType,
  initialShareableId,
  initialShareableName,
  onRefresh,
}: PublicLinkTabProps) {
  const [page, setPage] = useState(1)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const { data, isLoading } = usePublicLinks({ page, per_page: 10 })
  const revokeMutation = useRevokePublicLink()
  const { showAlert } = useAlert()

  const getPublicLinkUrl = useCallback((token: string) => {
    return `${env.appUrl}/public/${token}`
  }, [])

  const handleCopyLink = useCallback(
    async (token: string) => {
      const url = getPublicLinkUrl(token)
      try {
        await navigator.clipboard.writeText(url)
        setCopiedToken(token)
        setTimeout(() => setCopiedToken(null), 2000)
        showAlert({ type: 'success', message: 'Link copied to clipboard' })
      } catch {
        showAlert({ type: 'error', message: 'Failed to copy link' })
      }
    },
    [getPublicLinkUrl, showAlert]
  )

  const handleRevoke = async (id: number) => {
    if (!confirm('Are you sure you want to revoke this public link?')) return

    try {
      await revokeMutation.mutateAsync({ id })
      showAlert({ type: 'success', message: 'Public link revoked successfully' })
      onRefresh()
    } catch {
      showAlert({ type: 'error', message: 'Failed to revoke public link' })
    }
  }

  const handleCreateSuccess = () => {
    setShowCreateForm(false)
    onRefresh()
  }

  if (showCreateForm) {
    return (
      <CreatePublicLinkForm
        initialShareableType={initialShareableType}
        initialShareableId={initialShareableId}
        initialShareableName={initialShareableName}
        onSuccess={handleCreateSuccess}
        onCancel={() => setShowCreateForm(false)}
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Public Links
        </h3>
        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Create Public Link
        </button>
      </div>

      {/* Public Links List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loading size="lg" />
        </div>
      ) : !data?.data || data.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <LinkIcon className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" />
          <p>No public links found</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Create a public link to get started
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.data.map((link: PublicLinkListItem) => {
            const isRevoked = !!link.revoked_at
            const isExpired = link.expired_at
              ? new Date(link.expired_at) < new Date()
              : false

            return (
              <div
                key={link.public_link_id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {link.shareable_type === 'file' ? (
                    <DocumentIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  ) : (
                    <FolderIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {link.shareable_name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {link.permission}
                      </span>
                      {isRevoked && (
                        <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded">
                          Revoked
                        </span>
                      )}
                      {!isRevoked && isExpired && (
                        <span className="text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded">
                          Expired
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isRevoked && (
                    <button
                      type="button"
                      onClick={() => handleCopyLink(link.token)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Copy link"
                    >
                      {copiedToken === link.token ? (
                        <CheckIcon className="w-5 h-5" />
                      ) : (
                        <DocumentDuplicateIcon className="w-5 h-5" />
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRevoke(link.public_link_id)}
                    disabled={revokeMutation.isPending || isRevoked}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Revoke link"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )
          })}

          {/* Pagination */}
          {data.pagination.total_pages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {data.pagination.current_page} of {data.pagination.total_pages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(data.pagination.total_pages, p + 1))}
                  disabled={page === data.pagination.total_pages}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

