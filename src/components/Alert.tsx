import React, { useState } from 'react'
import clsx from 'clsx'

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
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

const iconColorClasses: Record<AlertType, string> = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400',
}

function DefaultIcon({ type }: { type: AlertType }) {
  const color = iconColorClasses[type]
  if (type === 'success') {
    return (
      <svg className={clsx(color, 'w-7 h-7')} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.707-9.707a1 1 0 0 0-1.414-1.414L9 10.172 7.707 8.879a1 1 0 1 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z" clipRule="evenodd" />
      </svg>
    )
  }
  if (type === 'error') {
    return (
      <svg className={clsx(color, 'w-7 h-7')} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM9 6h2v6H9V6Zm0 8h2v2H9v-2Z" clipRule="evenodd" />
      </svg>
    )
  }
  if (type === 'warning') {
    return (
      <svg className={clsx(color, 'w-7 h-7')} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.518 11.584c.75 1.333-.213 3.0-1.742 3.0H3.48c-1.53 0-2.492-1.667-1.742-3.0L8.257 3.1z" />
        <path d="M11 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 7h2v4H9V7z" fill="#fff" />
      </svg>
    )
  }
  return (
    <svg className={clsx(color, 'w-7 h-7')} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM9 8h2v5H9V8Zm0 6h2v2H9v-2Z" clipRule="evenodd" />
    </svg>
  )
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

  return (
    <div
      {...rest}
      role="alert"
      aria-live="polite"
      className={clsx('not-prose border rounded-lg p-4 mb-4', typeClasses[type], dismissible && 'relative', className)}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 flex items-center justify-center">
          {icon ?? <DefaultIcon type={type} />}
        </div>

        <div className="ml-4 flex-1">
          {heading && <h3 className="text-sm font-medium mb-1">{heading}</h3>}
          {message && <p className="text-sm">{message}</p>}
          {children && <div className="text-sm">{children}</div>}
        </div>

        {dismissible && (
          <div className="ml-4 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onDismiss?.()
              }}
              aria-label="Dismiss alert"
              className={clsx('inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors hover:bg-black/10', iconColorClasses[type])}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 8.586 4.293 2.879A1 1 0 1 0 2.879 4.293L8.586 10l-5.707 5.707a1 1 0 1 0 1.414 1.414L10 11.414l5.707 5.707a1 1 0 0 0 1.414-1.414L11.414 10l5.707-5.707A1 1 0 0 0 15.707 2.88L10 8.586z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

