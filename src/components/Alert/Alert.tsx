import clsx from 'clsx'
import { XMarkIcon } from '@heroicons/react/20/solid'
import type { AlertType, AlertProps } from '@/components/Alert/types'
import { useCloseAlert } from '@/components/Alert/alert.hook'

// helper: sinh class theo pattern alert-{part}-{type}
const v = (part: 'variant' | 'icon' | 'dismiss', type: AlertType) => `alert-${part}-${type}`

export default function Alert({
  type = 'info',
  message = '',
  heading,
  dismissible = true,
  icon, // giữ prop để không breaking, nhưng hiện không render icon bên trái nữa
  onDismiss,
  className,
  children,
  ...rest
}: AlertProps) {
  const { open, handleDismiss } = useCloseAlert(dismissible, onDismiss)
  if (!open) return null

  // role: error/warning khẩn → alert; còn lại status
  const role = (type === 'error' || type === 'warning') ? 'alert' : 'status'

  return (
    <div
      {...rest}
      role={role}
      className={clsx('alert-root', v('variant', type), dismissible && 'alert-root--dismissible', className)}
    >
      <div className="flex items-center">
        <div className="flex-1">
          {heading && <h3 className="text-sm font-medium leading-5 mb-0">{heading}</h3>}
          {message && <p className="text-sm leading-5 m-0">{message}</p>}
          {children && <div className="text-sm leading-5">{children}</div>}
        </div>

        {dismissible && (
          <div className="ml-3 flex-shrink-0 flex items-center">
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss alert"
              className={clsx(
                'inline-flex h-7 w-7 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
                v('icon', type),
                v('dismiss', type)
              )}
            >
              <XMarkIcon className="w-3.5 h-3.5 block pointer-events-none" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
