import React, { useEffect, useMemo, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

type Alignment = 'left' | 'right' | 'top' | 'bottom'
type Width = '25' | '50' | '75' | '100'

export type OffcanvasCloseButton = {
  position?: 'left' | 'right'
}

export type OffcanvasProps = {
  id?: string
  width?: Width
  /**
   * Deprecated: use `title` instead. Kept for backward compatibility.
   */
  heading?: string
  /**
   * Title text displayed in header when provided.
   */
  title?: string
  alignment?: Alignment
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  children?: React.ReactNode
  /**
   * Show a close button in header when provided. Default position is 'right'.
   */
  closeButton?: OffcanvasCloseButton | boolean
}

const widthToClass: Record<Width, string> = {
  '25': 'w-1/4',
  '50': 'w-1/2',
  '75': 'w-3/4',
  '100': 'w-full h-full',
}

const alignmentToPosition: Record<Alignment, string> = {
  left: 'left-0 top-0 h-full',
  right: 'right-0 top-0 h-full',
  top: 'top-0 left-0 w-full',
  bottom: 'bottom-0 left-0 w-full',
}


export default function Offcanvas({
  id,
  width = '50',
  heading = '',
  title,
  alignment = 'right',
  open,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  closeButton,
}: Readonly<OffcanvasProps>) {
  const reactId = React.useId()
  const domId = useMemo(() => id ?? `offcanvas-${reactId}`, [id, reactId])

  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen)
  const isControlled = typeof open === 'boolean'
  const isOpen = isControlled ? Boolean(open) : internalOpen
  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (isOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen])

  if (!isOpen) return null

  const widthClass = widthToClass[width] ?? widthToClass['50']
  const positionClass = alignmentToPosition[alignment] ?? alignmentToPosition['right']

  const hasTitle = Boolean(title ?? heading)
  let closeBtnConfig: OffcanvasCloseButton | null
  if (closeButton === false || closeButton === undefined) {
    closeBtnConfig = null
  } else if (typeof closeButton === 'boolean') {
    closeBtnConfig = { position: 'right' }
  } else {
    closeBtnConfig = { position: closeButton.position ?? 'right' }
  }

  return (
    <dialog id={domId} open className={clsx('not-prose fixed inset-0 z-50 overflow-hidden', className)}>
      {/* Backdrop as button for accessibility */}
      <button
        type="button"
        aria-label="Close offcanvas"
        className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm transition-opacity duration-300 opacity-0 animate-[fadeIn_150ms_ease-out_forwards]"
        onClick={() => setOpen(false)}
      />

      {/* Panel */}
      <div
        className={clsx(
          'bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 fixed will-change-transform',
          positionClass,
          widthClass,
          alignment === 'left' && 'animate-[slideInLeft_200ms_ease-out_forwards]',
          alignment === 'right' && 'animate-[slideInRight_200ms_ease-out_forwards]',
          alignment === 'top' && 'animate-[slideInTop_200ms_ease-out_forwards]',
          alignment === 'bottom' && 'animate-[slideInBottom_200ms_ease-out_forwards]'
        )}
      >
        {(hasTitle || closeBtnConfig) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className={clsx('flex items-center gap-2', closeBtnConfig?.position === 'left' ? 'order-2' : 'order-1')}
            >
              {hasTitle && (
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white leading-6">{title ?? heading}</h3>
              )}
            </div>
            {closeBtnConfig && (
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={clsx(
                  'w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all',
                  closeBtnConfig.position === 'left' ? '-ml-1 order-1' : '-mr-1 order-2'
                )}
                aria-label="Close offcanvas"
              >
                <XMarkIcon className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        <div className="p-5 text-gray-900 dark:text-gray-100">
          {children}
        </div>
      </div>
    </dialog>
  )
}


