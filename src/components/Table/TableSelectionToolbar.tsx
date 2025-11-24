import React from 'react'
import clsx from 'clsx'
import {
    ShareIcon,
    LinkIcon,
    TrashIcon,
    ArrowDownTrayIcon,
    FolderIcon,
    DocumentDuplicateIcon,
    PencilIcon,
    InformationCircleIcon,
    EllipsisHorizontalIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import type { TableToolbarAction } from './types'

const DEFAULT_ACTIONS: TableToolbarAction[] = [
    { id: 'share', label: 'Share', icon: <ShareIcon className="w-4 h-4" /> },
    { id: 'copyLink', label: 'Copy link', icon: <LinkIcon className="w-4 h-4" /> },
    { id: 'delete', label: 'Delete', icon: <TrashIcon className="w-4 h-4" /> },
    { id: 'download', label: 'Download', icon: <ArrowDownTrayIcon className="w-4 h-4" /> },
    { id: 'moveTo', label: 'Move to', icon: <FolderIcon className="w-4 h-4" /> },
    { id: 'copyTo', label: 'Copy to', icon: <DocumentDuplicateIcon className="w-4 h-4" /> },
    { id: 'rename', label: 'Rename', icon: <PencilIcon className="w-4 h-4" />, requireSingle: true },
    { id: 'details', label: 'Details', icon: <InformationCircleIcon className="w-4 h-4" />, requireSingle: true },
]

export type TableSelectionToolbarProps<T> = {
    selectedRows: T[]
    selectedCount: number
    actions?: TableToolbarAction[]
    onAction?: (actionId: string, rows: T[]) => void
    onDeselectAll: () => void
}

const MAX_PRIMARY_ACTIONS = 4

export default function TableSelectionToolbar<T>({
    selectedRows,
    selectedCount,
    actions = DEFAULT_ACTIONS,
    onAction,
    onDeselectAll,
}: TableSelectionToolbarProps<T>) {
    const [moreOpen, setMoreOpen] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement | null>(null)

    React.useEffect(() => {
        if (!moreOpen) return
        const handleClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setMoreOpen(false)
            }
        }
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setMoreOpen(false)
        }
        document.addEventListener('mousedown', handleClick)
        document.addEventListener('keydown', handleKey)
        return () => {
            document.removeEventListener('mousedown', handleClick)
            document.removeEventListener('keydown', handleKey)
        }
    }, [moreOpen])

    const primaryActions = actions.slice(0, MAX_PRIMARY_ACTIONS)
    const secondaryActions = actions.slice(MAX_PRIMARY_ACTIONS)

    const handleAction = (actionId: string) => {
        onAction?.(actionId, selectedRows)
        setMoreOpen(false)
    }

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2.5 flex items-center gap-3 flex-wrap shadow-sm">
            <div className="flex items-center gap-2 flex-wrap">
                {primaryActions.map(action => {
                    const disabled = action.requireSingle && selectedCount !== 1
                    return (
                        <button
                            key={action.id}
                            type="button"
                            disabled={disabled}
                            onClick={() => handleAction(action.id)}
                            className={clsx(
                                'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                                disabled
                                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                            )}
                        >
                            {action.icon}
                            <span className="hidden sm:inline">{action.label}</span>
                        </button>
                    )
                })}

                {secondaryActions.length > 0 && (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setMoreOpen(prev => !prev)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            aria-haspopup="menu"
                            aria-expanded={moreOpen}
                        >
                            <EllipsisHorizontalIcon className="w-4 h-4" />
                        </button>

                        {moreOpen && (
                            <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                                {secondaryActions.map(action => {
                                    const disabled = action.requireSingle && selectedCount !== 1
                                    return (
                                        <button
                                            key={action.id}
                                            type="button"
                                            disabled={disabled}
                                            onClick={() => handleAction(action.id)}
                                            className={clsx(
                                                'w-full px-4 py-2 text-sm text-left flex items-center gap-3 transition-colors',
                                                disabled
                                                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            )}
                                        >
                                            {action.icon}
                                            {action.label}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3 ml-auto">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{selectedCount} selected</span>
                <button
                    type="button"
                    onClick={onDeselectAll}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1"
                    title="Deselect all"
                >
                    <XMarkIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
