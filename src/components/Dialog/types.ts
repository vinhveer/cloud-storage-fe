export type ConfirmType = 'danger' | 'primary' | 'neutral'

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
  children?: React.ReactNode
}


