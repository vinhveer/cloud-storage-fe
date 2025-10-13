import React, { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'

type Alignment = 'left' | 'right' | 'top' | 'bottom'
type Width = '25' | '50' | '75' | '100'

export type OffcanvasProps = {
  id?: string
  width?: Width
  heading?: string
  alignment?: Alignment
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  children?: React.ReactNode
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

const enterFromTransform: Record<Alignment, string> = {
  left: '-translate-x-full',
  right: 'translate-x-full',
  top: '-translate-y-full',
  bottom: 'translate-y-full',
}

export default function Offcanvas({
  id,
  width = '50',
  heading = '',
  alignment = 'right',
  open,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
}: OffcanvasProps) {
  const reactId = React.useId()
  const domId = useMemo(() => id ?? `offcanvas-${reactId}`, [id, reactId])

  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen)
  const isControlled = typeof open === 'boolean'
  const isOpen = isControlled ? (open as boolean) : internalOpen
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
  const fromTransform = enterFromTransform[alignment] ?? enterFromTransform['right']

  return (
    <div id={domId} className={clsx('not-prose fixed inset-0 z-50 overflow-hidden', className)} role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setOpen(false)}
      />

      {/* Panel */}
      <div
        className={clsx(
          'bg-white shadow-2xl transition-transform duration-300 fixed',
          positionClass,
          widthClass
        )}
        style={{ transform: 'translate3d(0,0,0)' }}
      >
        {/* Slide-in using utility classes with initial transform */}
        <div className={clsx('min-h-full', fromTransform, 'data-[enter]:translate-x-0 data-[enter]:translate-y-0')} />

        {heading && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 leading-6">{heading}</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all -mr-1"
              aria-label="Close offcanvas"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 8.586 4.293 2.879A1 1 0 1 0 2.879 4.293L8.586 10l-5.707 5.707a1 1 0 1 0 1.414 1.414L10 11.414l5.707 5.707a1 1 0 0 0 1.414-1.414L11.414 10l5.707-5.707A1 1 0 0 0 15.707 2.88L10 8.586z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  )
}


