import React from 'react'

export function useDialogOpen({
  open,
  defaultOpen = false,
  onOpenChange,
}: { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [internalOpen, setInternalOpen] = React.useState<boolean>(defaultOpen)
  const isControlled = typeof open === 'boolean'
  const isOpen = isControlled ? (open as boolean) : internalOpen
  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }
  return { isOpen, setOpen }
}

export function useDialogCloseActions({
  isOpen,
  setOpen,
  closeOnEsc = true,
  closeOnBackdrop = true,
  onCancel,
}: {
  isOpen: boolean
  setOpen: (open: boolean) => void
  closeOnEsc?: boolean
  closeOnBackdrop?: boolean
  onCancel?: () => void
}) {
  React.useEffect(() => {
    if (!isOpen || !closeOnEsc) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        onCancel?.()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, closeOnEsc, onCancel, setOpen])

  const onBackdropClick = () => {
    if (!closeOnBackdrop) return
    setOpen(false)
    onCancel?.()
  }

  return { onBackdropClick }
}

export function useDialogConfirm({
  onConfirm,
  setOpen,
}: {
  onConfirm?: () => void | Promise<void>
  setOpen: (open: boolean) => void
}) {
  const [isLoading, setIsLoading] = React.useState(false)

  const onConfirmClick = async (e: React.MouseEvent) => {
    if (!onConfirm) return
    e.preventDefault()
    try {
      setIsLoading(true)
      await onConfirm()
      setOpen(false)
    } finally {
      setIsLoading(false)
    }
  }
  return { onConfirmClick, isLoading }
}


