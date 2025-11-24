import React from 'react'
import type { FileItem, MenuItem } from './types'

export interface ContextMenuProps {
    file: FileItem
    x: number
    y: number
    container?: HTMLDivElement | null
    onAction: (action: ContextMenuAction, file: FileItem) => void
    onClose: () => void
}

export default function ContextMenu({ file, x, y, container, onAction, onClose }: ContextMenuProps) {
    const menuRef = React.useRef<HTMLDivElement>(null)
    const [menuPos, setMenuPos] = React.useState({ x, y })

    // Set vị trí ban đầu theo tọa độ chuột
    React.useEffect(() => {
        // After first render we may know menu size -> adjust
        function clampPosition(rawX: number, rawY: number): { x: number; y: number } {
            const menuEl = menuRef.current
            if (!menuEl) return { x: rawX, y: rawY }
            const { width, height } = menuEl.getBoundingClientRect()
            if (container) {
                const rect = container.getBoundingClientRect()
                const offsetX = rawX - rect.left + container.scrollLeft
                const offsetY = rawY - rect.top + container.scrollTop
                const minX = container.scrollLeft
                const minY = container.scrollTop
                const maxX = container.scrollLeft + container.clientWidth - width
                const maxY = container.scrollTop + container.clientHeight - height
                return {
                    x: Math.min(Math.max(offsetX, minX), Math.max(minX, maxX)),
                    y: Math.min(Math.max(offsetY, minY), Math.max(minY, maxY)),
                }
            }
            const vw = window.innerWidth
            const vh = window.innerHeight
            return {
                x: Math.min(Math.max(rawX, 0), vw - width - 4),
                y: Math.min(Math.max(rawY, 0), vh - height - 4),
            }
        }
        requestAnimationFrame(() => {
            setMenuPos(clampPosition(x, y))
        })
    }, [x, y, container])

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

    const handleAction = (fn: (item: FileItem) => void) => {
        fn(file)
        onClose()
    }

    return (
        <div
            ref={menuRef}
            className="absolute z-50 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 animate-fade-in"
            style={{
                left: `${menuPos.x}px`,
                top: `${menuPos.y}px`,
            }}
        >
            {menuItems.map((item) => {
                const Icon = item.icon
                return (
                    <button
                        key={item.label}
                        onClick={() => handleAction(item.action)}
                        className={
                            'w-full px-4 py-2 text-sm text-left flex items-center gap-3 transition-colors ' +
                            (item.variant === 'danger'
                                ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800')
                        }
                        title={item.label}
                    >
                        <Icon className="w-4 h-4" />
                        {item.label}
                    </button>
                )
            })}
        </div>
    )
}
