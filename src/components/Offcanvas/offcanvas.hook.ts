import React, { useEffect, useMemo, useState } from 'react'
import type { OffcanvasProps } from '@/components/Offcanvas/types'

export function useOffcanvasState({
  id,
  open,
  defaultOpen = false,
  onOpenChange,
}: Pick<OffcanvasProps, 'id' | 'open' | 'defaultOpen' | 'onOpenChange'>) {
  const reactId = React.useId()
  const domId = useMemo(() => id ?? `offcanvas-${reactId}`, [id, reactId])

  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen)
  const isControlled = typeof open === 'boolean'
  const isOpen = isControlled ? Boolean(open) : internalOpen

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen])

  return { domId, isOpen, setOpen }
}


