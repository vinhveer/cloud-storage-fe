import { useState, useCallback } from 'react'
import {
  LinkIcon,
  PlusIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  DocumentIcon,
  FolderIcon,
  GlobeAltIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { usePublicLinks, useFilePublicLinks } from '@/api/features/public-link/public-link.queries'
import { useRevokePublicLink, useUpdatePublicLink } from '@/api/features/public-link/public-link.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'
import { useQueryClient } from '@tanstack/react-query'
import Loading from '@/components/Loading/Loading'
import CreatePublicLinkForm from './CreatePublicLinkForm'
import { env } from '@/api/config/env'
import type { PublicLinkListItem, FilePublicLinkItem } from '@/api/features/public-link/public-link.types'

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
  
  const queryClient = useQueryClient()
  const { showAlert } = useAlert()
  
  // Mode: per-resource (when initialShareableId is provided for file)
  const isResourceMode = initialShareableType === 'file' && initialShareableId && initialShareableId > 0
  
  // Fetch public links for specific file (resource mode)
  const { 
    data: fileLinksData, 
    isLoading: isLoadingFileLinks 
  } = useFilePublicLinks(isResourceMode ? initialShareableId : undefined)
  
  // Fetch all public links (dashboard mode)
  const { data: allLinksData, isLoading: isLoadingAllLinks } = usePublicLinks({ page, per_page: 10 })
  
  const revokeMutation = useRevokePublicLink()
  const updateMutation = useUpdatePublicLink()

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
    if (!confirm('Are you sure you want to revoke this public link? Anyone with this link will no longer have access.')) return

    try {
      await revokeMutation.mutateAsync({ id })
      showAlert({ type: 'success', message: 'Public link revoked successfully' })
      if (isResourceMode) {
        await queryClient.invalidateQueries({ queryKey: ['file-public-links', initialShareableId] })
      }
      onRefresh()
    } catch {
      showAlert({ type: 'error', message: 'Failed to revoke public link' })
    }
  }

  const handleUpdatePermission = async (id: number, permission: string) => {
    try {
      await updateMutation.mutateAsync({ id, permission })
      showAlert({ type: 'success', message: 'Permission updated' })
      if (isResourceMode) {
        await queryClient.invalidateQueries({ queryKey: ['file-public-links', initialShareableId] })
      }
      onRefresh()
    } catch {
      showAlert({ type: 'error', message: 'Failed to update permission' })
    }
  }

  const handleCreateSuccess = () => {
    setShowCreateForm(false)
    if (isResourceMode) {
      queryClient.invalidateQueries({ queryKey: ['file-public-links', initialShareableId] })
    }
    onRefresh()
  }

  // Show create form
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

  // ========== RESOURCE MODE: Show public links for specific file ==========
  if (isResourceMode) {
    if (isLoadingFileLinks) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loading size="lg" />
        </div>
      )
    }

    const activeLinks = fileLinksData?.public_links.filter(link => !link.revoked_at) || []
    const hasActiveLinks = activeLinks.length > 0

    // No public links for this file
    if (!hasActiveLinks) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
            <DocumentIcon className="w-8 h-8 text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {initialShareableName || fileLinksData?.file_name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">File</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-8 text-center">
            <GlobeAltIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Not published
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
              Create a public link to share this file with anyone, even if they don't have an account.
            </p>
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <LinkIcon className="w-5 h-5" />
              Publish to web
            </button>
          </div>
        </div>
      )
    }

    // Has public links - show them
    return (
      <div className="space-y-6">
        {/* Resource header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <DocumentIcon className="w-8 h-8 text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {initialShareableName || fileLinksData?.file_name}
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <GlobeAltIcon className="w-4 h-4" />
                Published to web
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            <PlusIcon className="w-4 h-4" />
            Create another link
          </button>
        </div>

        {/* Public links list */}
        <div className="space-y-4">
          {activeLinks.map((link: FilePublicLinkItem) => {
            const isExpired = link.expired_at ? new Date(link.expired_at) < new Date() : false
            const linkUrl = link.url || getPublicLinkUrl(link.token)

            return (
              <div
                key={link.public_link_id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4"
              >
                {/* Link URL */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Public link
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={linkUrl}
                      className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyLink(link.token)}
                      className="px-3 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                    >
                      {copiedToken === link.token ? (
                        <>
                          <CheckIcon className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <DocumentDuplicateIcon className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Permission & Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Permission
                      </label>
                      <select
                        value={link.permission}
                        onChange={(e) => handleUpdatePermission(link.public_link_id, e.target.value)}
                        disabled={updateMutation.isPending}
                        className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="view">View only</option>
                        <option value="download">Can download</option>
                      </select>
                    </div>

                    {link.expired_at && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Expires
                        </label>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <ClockIcon className="w-4 h-4" />
                          {new Date(link.expired_at).toLocaleDateString()}
                          {isExpired && (
                            <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded">
                              Expired
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRevoke(link.public_link_id)}
                    disabled={revokeMutation.isPending}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Unpublish
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ========== DASHBOARD MODE: Show all public links ==========
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
      {isLoadingAllLinks ? (
        <div className="flex items-center justify-center py-12">
          <Loading size="lg" />
        </div>
      ) : !allLinksData?.data || allLinksData.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <LinkIcon className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" />
          <p>No public links found</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Create a public link to get started
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {allLinksData.data.map((link: PublicLinkListItem) => {
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
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
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
                      {!isRevoked && !isExpired && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded">
                          Active
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
                  {!isRevoked && (
                    <button
                      type="button"
                      onClick={() => handleRevoke(link.public_link_id)}
                      disabled={revokeMutation.isPending}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Revoke link"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {/* Pagination */}
          {allLinksData.pagination.total_pages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {allLinksData.pagination.current_page} of {allLinksData.pagination.total_pages}
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
                  onClick={() => setPage((p) => Math.min(allLinksData.pagination.total_pages, p + 1))}
                  disabled={page === allLinksData.pagination.total_pages}
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

