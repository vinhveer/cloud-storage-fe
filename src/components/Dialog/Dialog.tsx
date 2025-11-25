import React, { useMemo } from 'react'
import clsx from 'clsx'
import { useDialogOpen, useDialogCloseActions, useDialogConfirm } from '@/components/Dialog/dialog.hook'
import type { DialogProps } from '@/components/Dialog/types'
import { confirmVariantMap } from '@/components/Dialog/constants'
import { Button } from '@/components/Button/Button'
import Loading from '@/components/Loading/Loading'


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
  children,
}: Readonly<DialogProps>) {
  const reactId = React.useId()
  const modalId = useMemo(() => id ?? `modal-${reactId}`, [id, reactId])

  const { isOpen, setOpen } = useDialogOpen({ open, defaultOpen, onOpenChange })

  const { onConfirmClick, isLoading } = useDialogConfirm({ onConfirm, setOpen })
  const confirmVariant = confirmVariantMap[confirmType] ?? 'secondary'

  const effectiveCloseOnEsc = closeOnEsc && !isLoading
  const effectiveCloseOnBackdrop = closeOnBackdrop && !isLoading
  const { onBackdropClick } = useDialogCloseActions({
    isOpen,
    setOpen,
    closeOnEsc: effectiveCloseOnEsc,
    closeOnBackdrop: effectiveCloseOnBackdrop,
    onCancel,
  })

  if (!isOpen) return null

  return (
    <div
      id={modalId}
      className={clsx('not-prose fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-50 opacity-0 animate-[fadeIn_150ms_ease-out_forwards]', className)}
      tabIndex={-1}
    >
      <div className="relative flex items-center justify-center min-h-dvh p-6">
        <button
          type="button"
          aria-label="Close dialog"
          className="absolute inset-0 w-full h-full"
          onClick={onBackdropClick}
          disabled={!effectiveCloseOnBackdrop}
        />
        <div
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-transparent dark:border-gray-800 opacity-0 scale-95 animate-[scaleIn_180ms_ease-out_forwards] z-10"
          aria-labelledby={`${modalId}-title`}
          aria-describedby={confirmText && !children ? `${modalId}-desc` : undefined}
        >
          <div className="px-6 pt-5 pb-4">
            {!isLoading && (
              <div className="mb-3">
                <h3 id={`${modalId}-title`} className="text-xl font-semibold text-gray-900 dark:text-white leading-6">
                  {title}
                </h3>
              </div>
            )}
            {!isLoading && (
              <>
                {children ? (
                  <div className="mb-5">
                    {children}
                  </div>
                ) : (
                  confirmText && (
                    <div className="mb-5">
                      <p id={`${modalId}-desc`} className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {confirmText}
                      </p>
                    </div>
                  )
                )}
              </>
            )}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loading size="2xl" />
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="md"
                  className="flex-1"
                  onClick={() => {
                    setOpen(false)
                    onCancel?.()
                  }}
                  aria-label={cancelButtonText}
                >
                  {cancelButtonText}
                </Button>

                {onConfirm ? (
                  <Button
                    size="md"
                    className="flex-1"
                    variant={confirmVariant}
                    onClick={onConfirmClick}
                  >
                    {confirmButtonText}
                  </Button>
                ) : (
                  <a href={confirmHref} className={clsx('not-prose btn', `btn-${confirmVariant}`, 'btn-md', 'flex-1')}>
                    {confirmButtonText}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}