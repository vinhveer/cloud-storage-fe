import type React from 'react'

export type AlertType = 'success' | 'error' | 'warning' | 'info'

export type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  type?: AlertType
  message?: string
  heading?: string | null
  dismissible?: boolean
  icon?: React.ReactNode
  onDismiss?: () => void
}


