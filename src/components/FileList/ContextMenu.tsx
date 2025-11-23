import React from 'react'
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
} from '@heroicons/react/24/outline'
import type { FileItem } from './types'

export type ContextMenuAction =
    | 'share'
    | 'copyLink'
    | 'manageAccess'
    | 'delete'
    | 'download'
    | 'rename'
    | 'moveTo'
    | 'copyTo'
    | 'details'

export interface ContextMenuProps {
    file: FileItem
    x: number
    y: number
    onAction: (action: ContextMenuAction, file: FileItem) => void
    onClose: () => void
}

export default function ContextMenu({ file, x, y, onAction, onClose }: ContextMenuProps) {
    const menuRef = React.useRef<HTMLDivElement>(null)
    const [menuPos, setMenuPos] = React.useState({ x, y })

    // Set vị trí ban đầu theo tọa độ chuột
    React.useEffect(() => {
        setMenuPos({ x, y })
    }, [x, y])

    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose()
            }
        }
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [onClose])

    const handleAction = (action: ContextMenuAction) => {
        onAction(action, file)
        onClose()
    }

    const menuItems: Array<{
        label: string
        icon: React.ReactNode
        action: ContextMenuAction
        divider?: boolean
    }> = [
            { label: 'Share', icon: <ShareIcon className="w-4 h-4" />, action: 'share' },
            { label: 'Copy link', icon: <LinkIcon className="w-4 h-4" />, action: 'copyLink' },
            { label: 'Manage access', icon: <LockOpenIcon className="w-4 h-4" />, action: 'manageAccess' },
            { label: 'Delete', icon: <TrashIcon className="w-4 h-4" />, action: 'delete', divider: true },
            { label: 'Download', icon: <ArrowDownTrayIcon className="w-4 h-4" />, action: 'download' },
            { label: 'Rename', icon: <PencilIcon className="w-4 h-4" />, action: 'rename' },
            { label: 'Move to', icon: <FolderIcon className="w-4 h-4" />, action: 'moveTo' },
            { label: 'Copy to', icon: <DocumentDuplicateIcon className="w-4 h-4" />, action: 'copyTo' },
            { label: 'Details', icon: <InformationCircleIcon className="w-4 h-4" />, action: 'details' },
        ]

    return (
        <div
            ref={menuRef}
            className="fixed z-50 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 animate-fade-in"
            style={{
                left: `${menuPos.x}px`,
                top: `${menuPos.y}px`,
            }}
        >
            {menuItems.map((item, idx) => (
                <React.Fragment key={item.action}>
                    <button
                        onClick={() => handleAction(item.action)}
                        className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-left flex items-center gap-3 transition-colors"
                        title={item.label}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                    {item.divider && idx < menuItems.length - 1 && (
                        <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}
