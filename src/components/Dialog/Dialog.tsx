import React, { useMemo } from 'react'
import clsx from 'clsx'
import { useDialogOpen, useDialogCloseActions, useDialogConfirm } from '@/components/Dialog/dialog.hook'
import type { DialogProps } from '@/components/Dialog/types'


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

  const { isOpen, setOpen } = useDialogOpen({ open, defaultOpen, onOpenChange })

  const { onBackdropClick } = useDialogCloseActions({ isOpen, setOpen, closeOnEsc, closeOnBackdrop, onCancel })

  const { onConfirmClick } = useDialogConfirm({ onConfirm, setOpen })

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
      className={clsx('not-prose fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-50 opacity-0 animate-[fadeIn_150ms_ease-out_forwards]', className)}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${modalId}-title`}
      aria-describedby={confirmText ? `${modalId}-desc` : undefined}
      onClick={onBackdropClick}
    >
      <div className="flex items-center justify-center min-h-dvh p-6">
        <div
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-transparent dark:border-gray-800 opacity-0 scale-95 animate-[scaleIn_180ms_ease-out_forwards]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 pt-5 pb-4">
            <div className="mb-3">
              <h3 id={`${modalId}-title`} className="text-xl font-semibold text-gray-900 dark:text-white leading-6">
                {title}
              </h3>
            </div>
            {confirmText && (
              <div className="mb-5">
                <p id={`${modalId}-desc`} className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
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