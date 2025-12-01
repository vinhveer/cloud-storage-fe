import { XMarkIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import type { OffcanvasProps, OffcanvasCloseButton } from '@/components/Offcanvas/types'
import { widthToClass, alignmentToPosition } from '@/components/Offcanvas/constants'
import { useOffcanvasState } from '@/components/Offcanvas/offcanvas.hook'

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
  const { domId, isOpen, setOpen } = useOffcanvasState({ id, open, defaultOpen, onOpenChange })

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
          'bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 fixed will-change-transform flex flex-col',
          positionClass,
          widthClass,
          alignment === 'left' && 'animate-[slideInLeft_200ms_ease-out_forwards]',
          alignment === 'right' && 'animate-[slideInRight_200ms_ease-out_forwards]',
          alignment === 'top' && 'animate-[slideInTop_200ms_ease-out_forwards]',
          alignment === 'bottom' && 'animate-[slideInBottom_200ms_ease-out_forwards]'
        )}
      >
        {(hasTitle || closeBtnConfig) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800 gap-2 flex-shrink-0">
            <div
              className={clsx(
                'flex min-w-0 items-center',
                closeBtnConfig?.position === 'left' ? 'order-2' : 'order-1'
              )}
            >
              {hasTitle && (
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white leading-6 break-words">
                  {title ?? heading}
                </h3>
              )}
            </div>
            {closeBtnConfig && (
              <div className={clsx('shrink-0 flex items-center justify-center', closeBtnConfig.position === 'left' ? 'order-1' : 'order-2')}>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all"
                  aria-label="Close offcanvas"
                >
                  <XMarkIcon className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        )}

        <div className={clsx('p-5 text-gray-900 dark:text-gray-100 flex-1 min-h-0 overflow-y-auto', className)}>
          {children}
        </div>
      </div>
    </dialog>
  )
}


