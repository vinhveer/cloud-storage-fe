import React from 'react'

// Manage alert visibility (open/close). When dismissed, hide the alert.
export function useAlertIconSize(dismissible = true, onDismiss?: () => void) {
  const [open, setOpen] = React.useState(true)

  const handleDismiss = React.useCallback(() => {
    if (!dismissible) return
    setOpen(false)
    onDismiss?.()
  }, [dismissible, onDismiss])

  return { open, handleDismiss }
}


