import React, { useState } from 'react'
import clsx from 'clsx'
import Loading from '@/components/Loading/Loading'
import type { TableProps, TableColumn } from './types'

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
}: TableProps<T>) {
    const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set())
    const [sortConfig, setSortConfig] = useState<{
        key: keyof T
        direction: 'asc' | 'desc'
    } | null>(null)

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
        const newSelected = new Set(selectedIds)
        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }
        setSelectedIds(newSelected as Set<string | number>)
        onSelectionChange?.([...newSelected] as (string | number)[])
    }

    // Handle select all
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSelected = e.target.checked ? new Set(data.map(row => row.id)) : new Set()
        setSelectedIds(newSelected as Set<string | number>)
        onSelectionChange?.([...newSelected] as (string | number)[])
    }

    const allSelected = data.length > 0 && selectedIds.size === data.length

    if (loading) {
        return (
            <div className={clsx('flex items-center justify-center py-12', className)}>
                <Loading size="md" />
            </div>
        )
    }

    return (
        <div className={clsx('overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700', className)}>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                {/* Header */}
                <thead className={clsx('bg-gray-50 dark:bg-gray-800', headerClassName)}>
                    <tr>
                        {selectable && (
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
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
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
                                className={clsx(
                                    'hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
                                    onRowClick && 'cursor-pointer',
                                    rowClassName
                                )}
                            >
                                {selectable && (
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
        </div>
    )
}
