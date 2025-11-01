import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export type UseAccountDropdownOptions = {
  userName: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function useAccountDropdown({ userName, open, defaultOpen = false, onOpenChange }: UseAccountDropdownOptions) {
  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen)
  const isControlled = typeof open === 'boolean'
  const isOpen = isControlled ? (open as boolean) : internalOpen
  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }
  const containerRef = useRef<HTMLDivElement | null>(null)

  const initials = useMemo(() => {
    const initialsStr = userName
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
      .slice(0, 2)
    return initialsStr || 'U'
  }, [userName])

  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen(!isOpen), [isOpen])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current) return
      if (containerRef.current.contains(event.target as Node)) return
      close()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [close])

  return {
    isOpen,
    setOpen,
    toggle,
    close,
    containerRef,
    initials,
  }
}


