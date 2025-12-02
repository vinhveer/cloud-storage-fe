import React from 'react'
import clsx from 'clsx'
import Loading from '@/components/Loading/Loading'
import TableSelectionToolbar from '../Table/TableSelectionToolbar'
import TableContextMenu from '../Table/TableContextMenu'
import type { TableContextMenuAction } from '../Table/types'
import { EllipsisHorizontalIcon, XMarkIcon, PlusIcon, TrashIcon, PencilIcon, EyeIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import type { TableDataProps } from './types'
import { useTableData } from './hooks/useTableData'

const DEFAULT_CONTEXT_MENU_ACTIONS: TableContextMenuAction[] = [
  { id: 'deselect', label: 'Bỏ chọn', icon: <XMarkIcon className="w-4 h-4" /> },
  { id: 'add', label: 'Thêm', icon: <PlusIcon className="w-4 h-4" /> },
  { id: 'edit', label: 'Sửa', icon: <PencilIcon className="w-4 h-4" /> },
  { id: 'detail', label: 'Chi tiết', icon: <EyeIcon className="w-4 h-4" /> },
  { id: 'delete', label: 'Xoá', icon: <TrashIcon className="w-4 h-4" /> },
]

/**
 * TableData Component
 * 
 * Full-height table component with infinite scroll and built-in context menu support.
 * 
 * Features:
 * - Full height (fills available space)
 * - Infinite scroll with IntersectionObserver
 * - Built-in context menu
 * - Row selection
 * - Sorting
 * - Custom rendering
 * 
 * @example
 * ```tsx
 * <TableData<User>
 *   columns={columns}
 *   data={users}
 *   selectable
 *   onLoadMore={() => fetchNextPage()}
 *   hasMore={hasNextPage}
 *   isLoadingMore={isFetchingNextPage}
 * />
 * ```
 */
export default function TableData<T extends { id: string | number }>({
  columns,
  data,
  className,
  rowClassName,
  headerClassName,
  loading = false,
  emptyMessage = 'Không có dữ liệu',
  onRowClick,
  selectable = false,
  onSelectionChange,
  toolbarActions,
  onToolbarAction,
  contextMenuActions,
  onContextMenuAction,
  enableContextMenu = true,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
}: TableDataProps<T>) {
  const [contextMenu, setContextMenu] = React.useState<{
    row: T
    x: number
    y: number
    container: HTMLDivElement
  } | null>(null)

  const {
    selectedIds,
    sortConfig,
    containerRef,
    loadMoreRef,
    sortedData,
    allSelected,
    hasSelection,
    showSelectionControls,
    selectedRows,
    handleSort,
    handleSelectRow,
    handleSelectAll,
    deselectAll,
  } = useTableData({
    data,
    columns,
    selectable,
    onSelectionChange,
    onLoadMore,
    hasMore,
    isLoadingMore,
    loading,
  })

  const handleToolbarAction = (actionId: string) => {
    if (!onToolbarAction) {
      return
    }
    onToolbarAction(actionId, selectedRows)
  }

  const openContextMenu = React.useCallback(
    (row: T, clientX: number, clientY: number) => {
      if (!enableContextMenu) return
      const containerEl = containerRef.current
      if (!containerEl) return
      setContextMenu({ row, x: clientX, y: clientY, container: containerEl })
    },
    [enableContextMenu]
  )

  const handleRowContextMenu = (row: T, e: React.MouseEvent<HTMLTableRowElement>) => {
    if (!enableContextMenu) return
    e.preventDefault()
    e.stopPropagation()
    openContextMenu(row, e.clientX, e.clientY)
  }

  const handleContextMenuAction = (actionId: string, row: T) => {
    if (!onContextMenuAction) {
      return
    }
    onContextMenuAction(actionId, row)
    setContextMenu(null)
  }

  const contextMenuRowId = contextMenu?.row.id

  if (loading && data.length === 0) {
    return (
      <div className={clsx('flex items-center justify-center h-full', className)}>
        <Loading size="md" />
      </div>
    )
  }

  return (
    <div className={clsx('flex flex-col h-full', className)}>
      {hasSelection && (
        <div className="flex-shrink-0 mb-4">
          <TableSelectionToolbar
            selectedRows={selectedRows}
            selectedCount={selectedRows.length}
            actions={toolbarActions}
            onAction={handleToolbarAction}
            onDeselectAll={deselectAll}
          />
        </div>
      )}

      <div
        ref={containerRef}
        className={clsx(
          'relative flex-1 min-h-0 overflow-x-auto overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700',
          'table-data-scrollbar'
        )}
      >
        <table className={clsx('min-w-full divide-y divide-gray-200 dark:divide-gray-700')}>
          {/* Header */}
          <thead className={clsx('bg-gray-100 dark:bg-gray-800 sticky top-0 z-10', headerClassName)}>
            <tr>
              {showSelectionControls && (
                <th className="px-6 py-3 text-left bg-gray-50 dark:bg-gray-800">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="w-5 h-5 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-transparent dark:bg-transparent text-blue-600 appearance-none"
                    style={allSelected ? {
                      backgroundColor: '#2563eb',
                      borderColor: 'transparent',
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3.5 8.5L6.5 11.5L12.5 4.5' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    } : undefined}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className={clsx(
                    'px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800',
                    col.sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right'
                  )}
                  onClick={() => handleSort(col)}
                  style={{ width: col.width }}
                >
                  <div className="flex items-center gap-2">
                    <span>{col.label}</span>
                    {col.sortable && sortConfig?.key === col.key && (
                      sortConfig.direction === 'asc' ? (
                        <ChevronUpIcon className="w-3 h-3" />
                      ) : (
                        <ChevronDownIcon className="w-3 h-3" />
                      )
                    )}
                  </div>
                </th>
              ))}
              {enableContextMenu && (
                <th className="px-3 py-3 text-right bg-gray-50 dark:bg-gray-800" />
              )}
            </tr>
          </thead>
          {/* Body */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (enableContextMenu ? 1 : 0)}
                  className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              <>
                {sortedData.map(row => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row)}
                    onContextMenu={event => handleRowContextMenu(row, event)}
                    className={clsx(
                      'transition-colors hover:bg-gray-100 dark:hover:bg-gray-800',
                      contextMenuRowId === row.id && 'bg-gray-100 dark:bg-gray-800',
                      onRowClick && 'cursor-pointer',
                      rowClassName
                    )}
                  >
                    {showSelectionControls && (
                      <td className="px-6 py-4 text-left">
                        {(() => {
                          const isSelected = selectedIds.has(row.id)
                          return (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={e => handleSelectRow(row.id, e as any)}
                              className="w-5 h-5 rounded-md border-2 border-gray-300 dark:border-gray-700 bg-transparent dark:bg-transparent text-blue-600 appearance-none"
                              style={isSelected ? {
                                backgroundColor: '#2563eb',
                                borderColor: 'transparent',
                                backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3.5 8.5L6.5 11.5L12.5 4.5' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                              } : undefined}
                              aria-label={`Select row ${row.id}`}
                            />
                          )
                        })()}
                      </td>
                    )}
                    {columns.map(col => {
                      const cellAlign = col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                      return (
                        <td
                          key={String(col.key)}
                          className={clsx(
                            'px-6 py-4 text-sm text-gray-900 dark:text-gray-100',
                            cellAlign
                          )}
                          style={{ width: col.width }}
                        >
                          {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                        </td>
                      )
                    })}
                    {enableContextMenu && (
                      <td className="px-3 py-4 text-right">
                        <button
                          type="button"
                          onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            openContextMenu(row, e.clientX, e.clientY)
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                          aria-label="Mở menu hành động"
                        >
                          <EllipsisHorizontalIcon className="w-5 h-5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {/* Infinite scroll trigger */}
                {onLoadMore && hasMore && (
                  <tr>
                    <td
                      colSpan={columns.length + (selectable ? 1 : 0) + (enableContextMenu ? 1 : 0)}
                      className="px-6 py-4 text-center"
                    >
                      <div ref={loadMoreRef} className="h-8 flex items-center justify-center">
                        {isLoadingMore && <Loading size="sm" />}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
        {contextMenu && enableContextMenu && (
          <TableContextMenu
            row={contextMenu.row}
            x={contextMenu.x}
            y={contextMenu.y}
            actions={contextMenuActions ?? DEFAULT_CONTEXT_MENU_ACTIONS}
            container={contextMenu.container}
            onAction={handleContextMenuAction}
            onClose={() => setContextMenu(null)}
          />
        )}
      </div>
    </div>
  )
}

