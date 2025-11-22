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
    EllipsisHorizontalIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/components/Button/Button'
import type { FileItem } from './types'

export type SelectionToolbarAction =
    | 'share'
    | 'copyLink'
    | 'delete'
    | 'download'
    | 'moveTo'
    | 'copyTo'
    | 'rename'
    | 'details'
    | 'deselectAll'

export interface SelectionToolbarProps {
    selectedItems: FileItem[]
    selectedCount: number
    onAction: (action: SelectionToolbarAction, items: FileItem[]) => void
    onDeselectAll: () => void
}

// Main toolbar actions - always visible
const mainActions: Array<{ id: SelectionToolbarAction; label: string; icon: React.ReactNode }> = [
    { id: 'share', label: 'Share', icon: <ShareIcon className="w-4 h-4" /> },
    { id: 'copyLink', label: 'Copy link', icon: <LinkIcon className="w-4 h-4" /> },
    { id: 'delete', label: 'Delete', icon: <TrashIcon className="w-4 h-4" /> },
    { id: 'download', label: 'Download', icon: <ArrowDownTrayIcon className="w-4 h-4" /> },
    { id: 'moveTo', label: 'Move to', icon: <FolderIcon className="w-4 h-4" /> },
]

// More actions - shown only in dropdown
const moreActions: Array<{ id: SelectionToolbarAction; label: string; icon: React.ReactNode }> = [
    { id: 'copyTo', label: 'Copy to', icon: <DocumentDuplicateIcon className="w-4 h-4" /> },
    { id: 'rename', label: 'Rename', icon: <PencilIcon className="w-4 h-4" /> },
    { id: 'details', label: 'Details', icon: <ShareIcon className="w-4 h-4" /> },
]

export default function SelectionToolbar({
    selectedItems,
    selectedCount,
    onAction,
    onDeselectAll,
}: SelectionToolbarProps) {
    const [moreOpen, setMoreOpen] = React.useState(false)
    const moreRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (!moreOpen) return
        const handleClickOutside = (e: MouseEvent) => {
            if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
                setMoreOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [moreOpen])

    const handleAction = (action: SelectionToolbarAction) => {
        onAction(action, selectedItems)
        setMoreOpen(false)
    }

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2.5 flex items-center gap-3 justify-between" style={{ width: '100%', maxWidth: 'calc(100%)' }}>
            {/* Left side - Main actions */}
            <div className="flex items-center gap-2">
                {mainActions.map(action => (
                    <button
                        key={action.id}
                        onClick={() => handleAction(action.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title={action.label}
                    >
                        {action.icon}
                        <span className="hidden sm:inline">{action.label}</span>
                    </button>
                ))}

                {/* More actions dropdown */}
                <div className="relative" ref={moreRef}>
                    <button
                        onClick={() => setMoreOpen(!moreOpen)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="More actions"
                    >
                        <EllipsisHorizontalIcon className="w-4 h-4" />
                    </button>

                    {moreOpen && (
                        <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                            {moreActions.map(action => (
                                <button
                                    key={action.id}
                                    onClick={() => handleAction(action.id)}
                                    disabled={action.id === 'rename' && selectedCount !== 1}
                                    className={clsx(
                                        'w-full px-4 py-2 text-sm text-left flex items-center gap-3 transition-colors',
                                        action.id === 'rename' && selectedCount !== 1
                                            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    )}
                                    title={action.label}
                                >
                                    {action.icon}
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right side - Selected count and clear button */}
            <div className="flex items-center gap-3 ml-auto">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {selectedCount} selected
                </span>
                <button
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