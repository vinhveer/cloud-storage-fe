import React, { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'

type ConfirmType = 'danger' | 'primary' | 'neutral'

export type DialogProps = {
  id?: string
  title: string
  confirmText?: string
  confirmButtonText?: string
  cancelButtonText?: string
  confirmHref?: string
  confirmType?: ConfirmType

  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void

  onConfirm?: () => void | Promise<void>
  onCancel?: () => void

  closeOnEsc?: boolean
  closeOnBackdrop?: boolean
  className?: string
}

export default function Dialog({
  id,
  title,
  confirmText = 'Are you sure?',
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  confirmHref = '#',
  confirmType = 'danger',
  open,
  defaultOpen = false,
  onOpenChange,
  onConfirm,
  onCancel,
  closeOnEsc = true,
  closeOnBackdrop = true,
  className,
}: DialogProps) {
  const reactId = React.useId()
  const modalId = useMemo(() => id ?? `modal-${reactId}`, [id, reactId])

  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen)
  const isControlled = typeof open === 'boolean'
  const isOpen = isControlled ? (open as boolean) : internalOpen
  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  useEffect(() => {
    if (!isOpen || !closeOnEsc) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        onCancel?.()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, closeOnEsc, onCancel])

  const onBackdropClick = () => {
    if (!closeOnBackdrop) return
    setOpen(false)
    onCancel?.()
  }

  const onConfirmClick = async (e: React.MouseEvent) => {
    if (onConfirm) {
      e.preventDefault()
      await onConfirm()
      setOpen(false)
    }
  }

  if (!isOpen) return null

  const confirmVariantClass =
    confirmType === 'danger'
      ? 'btn-danger'
      : confirmType === 'primary'
      ? 'btn-primary'
      : 'btn-secondary'

  return (
    <div
      id={modalId}
      className={clsx('not-prose fixed inset-0 bg-black/30 backdrop-blur-sm z-50', className)}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${modalId}-title`}
      aria-describedby={confirmText ? `${modalId}-desc` : undefined}
      onClick={onBackdropClick}
    >
      <div className="flex items-center justify-center min-h-dvh p-6">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 pt-5 pb-4">
            <div className="mb-3">
              <h3 id={`${modalId}-title`} className="text-xl font-semibold text-gray-900 leading-6">
                {title}
              </h3>
            </div>
            {confirmText && (
              <div className="mb-5">
                <p id={`${modalId}-desc`} className="text-sm text-gray-600 leading-relaxed">
                  {confirmText}
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                className={clsx('btn btn-md btn-secondary flex-1')}
                onClick={() => {
                  setOpen(false)
                  onCancel?.()
                }}
                aria-label={cancelButtonText}
              >
                {cancelButtonText}
              </button>

              {onConfirm ? (
                <a
                  href={confirmHref}
                  onClick={onConfirmClick}
                  className={clsx('btn btn-md flex-1 text-center', confirmVariantClass)}
                >
                  {confirmButtonText}
                </a>
              ) : (
                <a
                  href={confirmHref}
                  className={clsx('btn btn-md flex-1 text-center', confirmVariantClass)}
                >
                  {confirmButtonText}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


