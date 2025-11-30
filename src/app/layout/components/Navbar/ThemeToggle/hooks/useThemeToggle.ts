import { useState, useRef, useEffect } from 'react'
import { useTheme } from '@/app/providers/ThemeProvider'

export function useThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const buttonRef = useRef<HTMLDivElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  // Outside click / escape handling for theme menu
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!menuOpen) return
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [menuOpen])

  const handleSelectTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    setMenuOpen(false)
  }

  return {
    theme,
    menuOpen,
    setMenuOpen,
    handleSelectTheme,
    buttonRef,
    menuRef,
  }
}
