import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

type ThemeContextValue = {
  theme: Theme
  setTheme: (next: Theme) => void
  cycleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function prefersDark(): boolean {
  return !!globalThis.matchMedia && globalThis.matchMedia('(prefers-color-scheme: dark)').matches
}

function isDark(theme: Theme): boolean {
  return theme === 'dark' || (theme === 'system' && prefersDark())
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (isDark(theme)) root.classList.add('dark')
  else root.classList.remove('dark')
}

function getInitialTheme(): Theme {
  if (globalThis.window === undefined) return 'light'
  try {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
  } catch {}
  return 'light'
}

export function ThemeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  // Apply initial theme on mount
  useEffect(() => {
    applyTheme(theme)
  }, [])

  const setThemeCallback = useCallback((next: Theme) => {
    setTheme(next)
    applyTheme(next)
    try { localStorage.setItem('theme', next) } catch {}
  }, [])

  const cycleTheme = useCallback(() => {
    let next: Theme
    if (theme === 'light') next = 'dark'
    else if (theme === 'dark') next = 'system'
    else next = 'light'
    setThemeCallback(next)
  }, [theme, setThemeCallback])

  const value = useMemo(() => ({ theme, setTheme: setThemeCallback, cycleTheme }), [theme, setThemeCallback, cycleTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}