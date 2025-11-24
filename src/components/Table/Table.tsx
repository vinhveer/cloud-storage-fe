import React from 'react'
import clsx from 'clsx'
import Loading from '@/components/Loading/Loading'
import TableSelectionToolbar from './TableSelectionToolbar'
import TableContextMenu from './TableContextMenu'
import type { TableProps, TableColumn, TableContextMenuAction } from './types'
import {
    ShareIcon,
    LinkIcon,
    LockOpenIcon,
    TrashIcon,
    ArrowDownTrayIcon,
    PencilIcon,
    FolderIcon,
    DocumentDuplicateIcon,
    InformationCircleIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline'

const DEFAULT_CONTEXT_MENU_ACTIONS: TableContextMenuAction[] = [
    { id: 'share', label: 'Share', icon: <ShareIcon className="w-4 h-4" /> },
    { id: 'copyLink', label: 'Copy link', icon: <LinkIcon className="w-4 h-4" /> },
    { id: 'manageAccess', label: 'Manage access', icon: <LockOpenIcon className="w-4 h-4" /> },
    { id: 'delete', label: 'Delete', icon: <TrashIcon className="w-4 h-4" />, divider: true },
    { id: 'download', label: 'Download', icon: <ArrowDownTrayIcon className="w-4 h-4" /> },
    { id: 'rename', label: 'Rename', icon: <PencilIcon className="w-4 h-4" /> },
    { id: 'moveTo', label: 'Move to', icon: <FolderIcon className="w-4 h-4" /> },
    { id: 'copyTo', label: 'Copy to', icon: <DocumentDuplicateIcon className="w-4 h-4" /> },
    { id: 'details', label: 'Details', icon: <InformationCircleIcon className="w-4 h-4" /> },
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
    const [selectionMode, setSelectionMode] = React.useState(false)

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
    const showSelectionControls = selectable && (selectionMode || hasSelection)
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
    const toggleSelectionMode = () => {
        if (!selectable) return
        setSelectionMode(prev => {
            const next = !prev
            if (!next) {
                setSelection([])
            }
            return next
        })
    }
    const enableSelectionMode = () => setSelectionMode(true)
    const selectAllRows = () => setSelection(data.map(row => row.id))

    const handleRowContextMenu = (row: T, e: React.MouseEvent<HTMLTableRowElement>) => {
        if (!enableContextMenu) return
        e.preventDefault()
        e.stopPropagation()
        const containerEl = containerRef.current
        if (!containerEl) return
        if (selectable) {
            enableSelectionMode()
            setSelection([row.id])
        }
        setContextMenu({ row, x: e.clientX, y: e.clientY, container: containerEl })
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

            <div ref={containerRef} className={clsx('relative overflow-x-auto h-full rounded-lg border border-gray-200 dark:border-gray-700', className)}>
                <table className={clsx('mt-0 mb-0 min-w-full h-full divide-y divide-gray-200 dark:divide-gray-700')}>
                    {/* Header */}
                    <thead className={clsx('bg-gray-50 dark:bg-gray-800', headerClassName)}>
                        {selectable && (
                            <tr>
                                <th
                                    colSpan={columns.length + (selectable ? 1 : 0)}
                                    className="px-6 py-3 text-left bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex flex-wrap items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={toggleSelectionMode}
                                            className={clsx(
                                                'flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200',
                                                selectionMode
                                                    ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600 focus:ring-blue-500'
                                                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-blue-200'
                                            )}
                                            aria-pressed={selectionMode}
                                        >
                                            <CheckCircleIcon className="w-4 h-4" />
                                            <span>{selectionMode ? 'Cancel' : 'Select'}</span>
                                        </button>

                                        {selectionMode && (
                                            <div className="flex flex-wrap items-center gap-2 text-sm">
                                                <button
                                                    type="button"
                                                    onClick={selectAllRows}
                                                    className="px-3 py-2 font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                >
                                                    Select All
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={deselectAll}
                                                    className="px-3 py-2 font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                                                >
                                                    Deselect All
                                                </button>
                                                {selectedIds.size > 0 && (
                                                    <span className="text-gray-500">({selectedIds.size} selected)</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </th>
                            </tr>
                        )}
                        <tr>
                            {showSelectionControls && (
                                <th className="px-6 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={handleSelectAll}
                                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600"
                                        aria-label="Select all rows"
                                    />
                                </th>
                            )}
                            {columns.map(col => (
                                <th
                                    key={String(col.key)}
                                    className={clsx(
                                        'px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300',
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
                                            <span className="text-xs">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {/* Body */}
                    <tbody className=" divide-y divide-gray-200 dark:divide-gray-700">
                        {sortedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (selectable ? 1 : 0)}
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
                                        'hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
                                        onRowClick && 'cursor-pointer',
                                        rowClassName
                                    )}
                                >
                                    {showSelectionControls && (
                                        <td className="px-6 py-4 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(row.id)}
                                                onChange={e => handleSelectRow(row.id, e as any)}
                                                className="rounded border-gray-300 dark:border-gray-600 text-blue-600"
                                                aria-label={`Select row ${row.id}`}
                                            />
                                        </td>
                                    )}
                                    {columns.map(col => (
                                        <td
                                            key={String(col.key)}
                                            className={clsx(
                                                'px-6 py-4 text-sm text-gray-900 dark:text-gray-100',
                                                col.align === 'center' && 'text-center',
                                                col.align === 'right' && 'text-right'
                                            )}
                                            style={{ width: col.width }}
                                        >
                                            {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                                        </td>
                                    ))}
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
