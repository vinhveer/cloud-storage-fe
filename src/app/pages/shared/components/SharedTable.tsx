import React from 'react'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { getDefaultFileIcon } from '@/components/FileList/file-list.icons'
import Loading from '@/components/Loading/Loading'
import type { SharedItem, Tab } from '../types'

export type SharedTableProps = {
  items: SharedItem[]
  isLoading: boolean
  activeTab: Tab
  onItemClick?: (item: SharedItem) => void
  onMoreClick?: (e: React.MouseEvent, item: SharedItem) => void
}

export default function SharedTable({
  items,
  isLoading,
  activeTab,
  onItemClick,
  onMoreClick,
}: Readonly<SharedTableProps>) {
  console.log('SharedTable props', {
    activeTab,
    isLoading,
    itemsLength: items.length,
    items,
  })

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
        <p>No shared items found</p>
      </div>
    )
  }

  return (
    <table className="min-w-full text-sm text-gray-900 dark:text-gray-100">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-900">
          <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Name</th>
          <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Date shared</th>
          <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
            {activeTab === 'with' ? 'Shared by' : 'Shared with'}
          </th>
          {onMoreClick && (
            <th className="px-6 py-3 text-right font-medium text-gray-600 dark:text-gray-400 w-12"></th>
          )}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr
            key={item.id}
            className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors cursor-pointer"
            onClick={() => onItemClick?.(item)}
          >
            <td className="px-6 py-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">{getDefaultFileIcon(item, 'w-6 h-6')}</div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{item.name}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{item.sharedDate}</td>
            <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{item.owner}</td>
            {onMoreClick && (
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
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

