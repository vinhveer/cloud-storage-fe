import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import InfoIcon from '@/components/Alert/icons/InfoIcon'
import SuccessIcon from '@/components/Alert/icons/SuccessIcon'
import WarningIcon from '@/components/Alert/icons/WarningIcon'
import ErrorIcon from '@/components/Alert/icons/ErrorIcon'

type AlertType = 'success' | 'error' | 'warning' | 'info'

export type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  type?: AlertType
  message?: string
  heading?: string | null
  dismissible?: boolean
  icon?: React.ReactNode
  onDismiss?: () => void
}

const typeClasses: Record<AlertType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-200',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-200',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-200',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-200',
}

const iconColorClasses: Record<AlertType, string> = {
  success: 'text-green-400 dark:text-green-300',
  error: 'text-red-400 dark:text-red-300',
  warning: 'text-yellow-400 dark:text-yellow-300',
  info: 'text-blue-400 dark:text-blue-300',
}

const dismissBgClasses: Record<AlertType, string> = {
  success: 'bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800',
  error: 'bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800',
  warning: 'bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-800',
  info: 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800',
}

const IconComponents: Record<
  AlertType,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
}

export default function Alert({
  type = 'info',
  message = '',
  heading = null,
  dismissible = true,
  icon,
  onDismiss,
  className,
  children,
  ...rest
}: AlertProps) {
  const [open, setOpen] = useState(true)
  if (!open) return null
  const IconComp = IconComponents[type]
  const contentRef = useRef<HTMLDivElement>(null)
  const [iconSize, setIconSize] = useState<number>(24)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const update = () => {
      const h = el.getBoundingClientRect().height
      // Icon size follows content height, with a modest clamp for compact alerts
      let size = Math.round(h - 6)
      size = Math.max(20, Math.min(28, size))
      setIconSize(size)
    }
    update()
    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => update())
      ro.observe(el)
    }
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('resize', update)
      if (ro) ro.disconnect()
    }
  }, [])

  return (
    <div
      {...rest}
      role="alert"
      aria-live="polite"
      className={clsx('not-prose border rounded-lg px-4 py-2 mb-3', typeClasses[type], dismissible && 'relative', className)}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 flex items-center justify-center px-2">
          {icon ?? (
            <IconComp
              className={clsx('block', iconColorClasses[type])}
              style={{ height: iconSize, width: iconSize }}
            />
          )}
        </div>

        <div ref={contentRef} className="ml-3 flex-1">
          {heading && <h3 className="text-sm font-medium leading-5 mb-0">{heading}</h3>}
          {message && <p className="text-sm leading-5 m-0 mt-0">{message}</p>}
          {children && <div className="text-sm leading-5">{children}</div>}
        </div>

        {dismissible && (
          <div className="ml-3 flex-shrink-0 flex items-center">
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onDismiss?.()
              }}
              aria-label="Dismiss alert"
              className={clsx('inline-flex h-7 w-7 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors', iconColorClasses[type], dismissBgClasses[type])}
            >
              <svg className="w-3.5 h-3.5 block pointer-events-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 8.586 4.293 2.879A1 1 0 1 0 2.879 4.293L8.586 10l-5.707 5.707a1 1 0 1 0 1.414 1.414L10 11.414l5.707 5.707a1 1 0 0 0 1.414-1.414L11.414 10l5.707-5.707A1 1 0 0 0 15.707 2.88L10 8.586z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

