import type React from 'react'

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
  /** Layout của buttons: 'full' (full width) hoặc 'auto' (auto width, căn trái) */
  buttonLayout?: 'full' | 'auto'
}


