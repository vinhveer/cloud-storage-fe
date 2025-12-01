import { LinkIcon, DocumentIcon, FolderIcon, EllipsisVerticalIcon, ClipboardIcon } from '@heroicons/react/24/outline'
import Loading from '@/components/Loading/Loading'
import type { PublicLinkItem } from '../types'
import { formatDate } from '../utils'
import clsx from 'clsx'
import { useState, useCallback } from 'react'
import { useAlert } from '@/components/Alert/AlertProvider'

export type PublicLinksTableProps = {
  items: PublicLinkItem[]
  isLoading: boolean
  onItemClick?: (item: PublicLinkItem) => void
  onMoreClick?: (e: React.MouseEvent, item: PublicLinkItem) => void
}

export default function PublicLinksTable({
  items,
  isLoading,
  onItemClick,
  onMoreClick,
}: Readonly<PublicLinksTableProps>) {
  const { showAlert } = useAlert()
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  const getPublicLinkUrl = useCallback((item: PublicLinkItem) => {
    return item.url || `${window.location.origin}/public/${item.token}`
  }, [])

  const handleCopyLink = useCallback(
    async (e: React.MouseEvent, item: PublicLinkItem) => {
      e.stopPropagation()
      const url = getPublicLinkUrl(item)
      try {
        await navigator.clipboard.writeText(url)
        setCopiedToken(item.token)
        setTimeout(() => setCopiedToken(null), 2000)
        showAlert({ type: 'success', message: 'Link copied to clipboard' })
      } catch {
        showAlert({ type: 'error', message: 'Failed to copy link' })
      }
    },
    [getPublicLinkUrl, showAlert]
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading size="lg" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <LinkIcon className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" />
        <p>No public links found</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Create a public link to get started
        </p>
      </div>
    )
  }

  return (
    <table className="min-w-full text-sm text-gray-900 dark:text-gray-100">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-900">
          <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Name</th>
          <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Type</th>
          <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Permission</th>
          <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Link</th>
          <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Status</th>
          <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Expires</th>
          <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Created</th>
          <th className="px-6 py-3 text-right font-medium text-gray-600 dark:text-gray-400 w-12"></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          const linkUrl = getPublicLinkUrl(item)
          const isCopied = copiedToken === item.token
          return (
            <tr
              key={item.public_link_id}
              className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors"
            >
              <td className="px-6 py-3">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => onItemClick?.(item)}
                >
                  <div className="flex-shrink-0">
                    {item.shareable_type === 'folder' ? (
                      <FolderIcon className="w-5 h-5 text-blue-500" />
                    ) : (
                      <DocumentIcon className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{item.shareable_name}</div>
                </div>
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300 capitalize">
                {item.shareable_type}
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300 capitalize">
                {item.permission}
              </td>
              <td className="px-6 py-3">
                <div className="flex items-center gap-2 max-w-xs">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate font-mono">
                      {linkUrl.replace(window.location.origin, '')}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleCopyLink(e, item)}
                    className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                    title="Copy link"
                  >
                    {isCopied ? (
                      <span className="text-xs text-green-600 dark:text-green-400">Copied</span>
                    ) : (
                      <ClipboardIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    )}
                  </button>
                </div>
              </td>
              <td className="px-6 py-3">
                <span
                  className={clsx(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    item.status === 'active'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : item.status === 'expired'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  )}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                {item.expired_at ? formatDate(item.expired_at) : 'Never'}
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{formatDate(item.created_at)}</td>
              <td className="px-6 py-3 text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onMoreClick?.(e, item)
                  }}
                  className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="More options"
                >
                  <EllipsisVerticalIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

