import React from 'react'

export function useCloseAlert(dismissible = true, onDismiss?: () => void) {
  const [open, setOpen] = React.useState(true)

  const handleDismiss = React.useCallback(() => {
    if (!dismissible) return
    setOpen(false)
    onDismiss?.()
  }, [dismissible, onDismiss])

  return { open, handleDismiss }
}