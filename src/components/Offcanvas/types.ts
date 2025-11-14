import type React from 'react'

export type Alignment = 'left' | 'right' | 'top' | 'bottom'

export type Width = '25' | '50' | '75' | '100'

export type OffcanvasCloseButton = {
  position?: 'left' | 'right'
}

export type OffcanvasProps = {
  id?: string
  width?: Width
  /**
   * Deprecated: use `title` instead. Kept for backward compatibility.
   */
  heading?: string
  /**
   * Title text displayed in header when provided.
   */
  title?: string
  alignment?: Alignment
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  children?: React.ReactNode
  /**
   * Show a close button in header when provided. Default position is 'right'.
   */
  closeButton?: OffcanvasCloseButton | boolean
}


