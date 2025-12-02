import React from 'react'
import clsx from 'clsx'
import Loading from '@/components/Loading/Loading'
import TableSelectionToolbar from './TableSelectionToolbar'
import TableContextMenu from './TableContextMenu'
import type { TableProps, TableColumn, TableContextMenuAction } from './types'
import { PlusIcon, TrashIcon, PencilIcon, XMarkIcon, EyeIcon, EllipsisHorizontalIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

const DEFAULT_CONTEXT_MENU_ACTIONS: TableContextMenuAction[] = [
    { id: 'deselect', label: 'Bỏ chọn', icon: <XMarkIcon className="w-4 h-4" /> },
    { id: 'add', label: 'Thêm', icon: <PlusIcon className="w-4 h-4" /> },
    { id: 'edit', label: 'Sửa', icon: <PencilIcon className="w-4 h-4" /> },
    { id: 'detail', label: 'Chi tiết', icon: <EyeIcon className="w-4 h-4" /> },
    { id: 'delete', label: 'Xoá', icon: <TrashIcon className="w-4 h-4" /> },
]

/**
 * Table Component
 * 
 * Hiển thị dữ liệu dạng bảng với hỗ trợ:
 * - Sort cột (có thể config)
 * - Chọn hàng (selectable)
 * - Custom render từng cell
 * - Loading state
 * - Empty state
 * 
 * @example
 * ```tsx
 * <Table<User>
 *   columns={columns}
 *   data={users}
 *   selectable
 *   onRowClick={(row) => console.log(row)}
 * />
 * ```
 */
export default function Table<T extends { id: string | number }>({
    columns,
    data,
    className,
    rowClassName,
    headerClassName,
    maxBodyHeight,
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
}: TableProps<T>) {
    const [selectedIds, setSelectedIds] = React.useState<Set<string | number>>(new Set())
    const [sortConfig, setSortConfig] = React.useState<{
        key: keyof T
        direction: 'asc' | 'desc'
    } | null>(null)
    const containerRef = React.useRef<HTMLDivElement | null>(null)
    const [contextMenu, setContextMenu] = React.useState<{
        row: T
        x: number
        y: number
        container: HTMLDivElement
    } | null>(null)

    const applySelection = React.useCallback(
        (updater: (prev: Set<string | number>) => Set<string | number>) => {
            setSelectedIds(prev => {
                const next = updater(prev)
                onSelectionChange?.([...next])
                return next
            })
        },
        [onSelectionChange]
    )

    const setSelection = React.useCallback(
        (ids: Array<string | number>) => {
            setSelectedIds(() => {
                const next = new Set(ids)
                onSelectionChange?.([...next])
                return next
            })
        },
        [onSelectionChange]
    )

    // Handle sort
    const handleSort = (column: TableColumn<T>) => {
        if (!column.sortable) return

        if (sortConfig?.key === column.key) {
            // Toggle direction
            setSortConfig({
                key: column.key,
                direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
            })
        } else {
            setSortConfig({ key: column.key, direction: 'asc' })
        }
    }

    // Sort data
    const sortedData = sortConfig
        ? [...data].sort((a, b) => {
            const aVal = a[sortConfig.key]
            const bVal = b[sortConfig.key]

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })
        : data

    // Handle row selection
    const handleSelectRow = (id: string | number, e: React.MouseEvent) => {
        e.stopPropagation()
        applySelection(prev => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }

    // Handle select all
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelection(data.map(row => row.id))
        } else {
            setSelection([])
        }
    }

    const allSelected = data.length > 0 && selectedIds.size === data.length
    const hasSelection = selectable && selectedIds.size > 0
    const showSelectionControls = selectable
    const selectedRows = React.useMemo(() => data.filter(row => selectedIds.has(row.id)), [data, selectedIds])

    const handleToolbarAction = (actionId: string) => {
        if (!onToolbarAction) {
            // eslint-disable-next-line no-console
            console.log('[Table] toolbar action', actionId, selectedRows)
            return
        }
        onToolbarAction(actionId, selectedRows)
    }

    const deselectAll = () => setSelection([])

    const openContextMenu = React.useCallback(
        (row: T, clientX: number, clientY: number) => {
            if (!enableContextMenu) return
            const containerEl = containerRef.current
            if (!containerEl) return
            // Không thay đổi selection, chỉ mở context menu
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
            // eslint-disable-next-line no-console
            console.log('[Table] context action', actionId, row)
        } else {
            onContextMenuAction(actionId, row)
        }
        setContextMenu(null)
    }

    const contextMenuRowId = contextMenu?.row.id

    if (loading) {
        return (
            <div className={clsx('flex items-center justify-center', className)}>
                <Loading size="md" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {hasSelection && (
                <TableSelectionToolbar
                    selectedRows={selectedRows}
                    selectedCount={selectedRows.length}
                    actions={toolbarActions}
                    onAction={handleToolbarAction}
                    onDeselectAll={deselectAll}
                />
            )}

            <div
                ref={containerRef}
                className={clsx(
                    'relative overflow-x-auto h-full rounded-lg border border-gray-200 dark:border-gray-700',
                    maxBodyHeight && 'overflow-y-auto',
                    className,
                )}
                style={maxBodyHeight ? { maxHeight: typeof maxBodyHeight === 'number' ? `${maxBodyHeight}px` : maxBodyHeight } : undefined}
            >
                <table className={clsx('mt-0 mb-0 min-w-full h-full divide-y divide-gray-200 dark:divide-gray-700')}>
                    {/* Header */}
                    <thead className={clsx('bg-gray-100 dark:bg-gray-800', headerClassName)}>
                        <tr>
                            {showSelectionControls && (
                                <th className="px-6 py-3 text-left sticky top-0 z-10 bg-gray-50 dark:bg-gray-800">
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
                                        'px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 sticky top-0 z-10 bg-gray-50 dark:bg-gray-800',
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
                                <th className="px-3 py-3 text-right sticky top-0 z-10 bg-gray-50 dark:bg-gray-800" />
                            )}
                        </tr>
                    </thead>
                    {/* Body */}
                    <tbody className=" divide-y divide-gray-200 dark:divide-gray-700">
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
                            sortedData.map(row => (
                                <tr
                                    key={row.id}
                                    onClick={() => onRowClick?.(row)}
                                    onContextMenu={event => handleRowContextMenu(row, event)}
                                    className={clsx(
                                        // Stronger hover color
                                        'transition-colors hover:bg-gray-100 dark:hover:bg-gray-800',
                                        // Highlight row when context menu is open for it
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
                            ))
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
        </div >
    )
}
