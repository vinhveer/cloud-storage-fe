import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  try {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved === 'light' || saved === 'dark') return saved
  } catch {}
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    applyThemeToDocument(theme)
    try {
      localStorage.setItem('theme', theme)
    } catch {}
  }, [theme])

  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handle = () => {
      const saved = (() => {
        try { return localStorage.getItem('theme') as Theme | null } catch { return null }
      })()
      if (saved === null) setThemeState(mq.matches ? 'dark' : 'light')
    }
    mq.addEventListener?.('change', handle)
    return () => mq.removeEventListener?.('change', handle)
  }, [])

  const setTheme = useCallback((next: Theme) => setThemeState(next), [])
  const toggleTheme = useCallback(() => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}