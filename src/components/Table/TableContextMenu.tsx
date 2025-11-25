import React from 'react'
import type { TableContextMenuAction } from './types'

export type TableContextMenuProps<T> = {
    row: T
    x: number
    y: number
    actions: TableContextMenuAction[]
    container?: HTMLDivElement | null
    onAction?: (actionId: string, row: T) => void
    onClose: () => void
}

export default function TableContextMenu<T>({ row, x, y, actions, container, onAction, onClose }: TableContextMenuProps<T>) {
    const menuRef = React.useRef<HTMLDivElement | null>(null)
    const [position, setPosition] = React.useState({ x, y })

    React.useEffect(() => {
        function clamp(rawX: number, rawY: number) {
            const menuEl = menuRef.current
            if (!menuEl) return { x: rawX, y: rawY }
            const { width, height } = menuEl.getBoundingClientRect()

            // Nếu có container (bảng), clamp toạ độ trong vùng visible của bảng theo viewport
            if (container) {
                const rect = container.getBoundingClientRect()
                const minX = rect.left
                const maxX = rect.right - width
                const minY = rect.top
                const maxY = rect.bottom - height
                return {
                    x: Math.min(Math.max(rawX, minX), Math.max(minX, maxX)),
                    y: Math.min(Math.max(rawY, minY), Math.max(minY, maxY)),
                }
            }

            // Nếu không có container, clamp trong viewport
            return {
                x: Math.min(Math.max(rawX, 0), window.innerWidth - width - 4),
                y: Math.min(Math.max(rawY, 0), window.innerHeight - height - 4),
            }
        }

        const frame = requestAnimationFrame(() => {
            setPosition(clamp(x, y))
        })
        return () => cancelAnimationFrame(frame)
    }, [x, y, container])

    React.useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose()
            }
        }
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }
        document.addEventListener('mousedown', handleClick)
        document.addEventListener('keydown', handleKey)
        return () => {
            document.removeEventListener('mousedown', handleClick)
            document.removeEventListener('keydown', handleKey)
        }
    }, [onClose])

    const handleAction = (actionId: string) => {
        onAction?.(actionId, row)
        onClose()
    }

    return (
        <div
            ref={menuRef}
            className="fixed z-50 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
            style={{ left: position.x, top: position.y }}
        >
            {actions.map((action, index) => (
                <React.Fragment key={action.id}>
                    <button
                        type="button"
                        onClick={() => handleAction(action.id)}
                        className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-left flex items-center gap-3"
                    >
                        {action.icon}
                        {action.label}
                    </button>
                    {action.divider && index < actions.length - 1 && <div className="my-1 border-t border-gray-200 dark:border-gray-700" />}
                </React.Fragment>
            ))}
        </div>
    )
}
