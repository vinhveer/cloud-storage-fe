import { createContext, useContext, useMemo, useState, useCallback } from 'react'

export type SidebarItemData = {
  key: string
  title: string
  href?: string
  icon?: React.ReactNode
}

type SidebarContextValue = {
  items: SidebarItemData[]
  setItems: (items: SidebarItemData[]) => void
  activeKey?: string
  setActiveKey: (key?: string) => void
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const STORAGE = { active: 'sidebar:activeKey' }

  function getInitial(): { items: SidebarItemData[]; activeKey?: string } {
    if (typeof window === 'undefined') return { items: [], activeKey: undefined }
    try {
      const rawActive = sessionStorage.getItem(STORAGE.active)
      return { items: [], activeKey: rawActive ?? undefined }
    } catch {
      return { items: [], activeKey: undefined }
    }
  }

  const initial = getInitial()
  const [items, setItemsState] = useState<SidebarItemData[]>(initial.items)
  const [activeKey, setActiveKeyState] = useState<string | undefined>(initial.activeKey)

  const setItems = useCallback((next: SidebarItemData[]) => {
    setItemsState(next)
  }, [])

  const setActiveKey = useCallback((key?: string) => {
    setActiveKeyState(key)
    try {
      if (key === undefined) sessionStorage.removeItem(STORAGE.active)
      else sessionStorage.setItem(STORAGE.active, key)
    } catch {}
  }, [])

  const value = useMemo(() => ({ items, setItems, activeKey, setActiveKey }), [items, activeKey, setItems, setActiveKey])
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
  return ctx
}


