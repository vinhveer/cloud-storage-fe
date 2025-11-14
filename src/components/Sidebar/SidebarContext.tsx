import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import type { SidebarContextValue, SidebarItemData, SidebarProviderProps } from '@/components/Sidebar/types'

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

export function SidebarProvider({ children }: SidebarProviderProps) {
  const STORAGE = { active: 'sidebar:activeKey' }

  function getInitial(): { items: SidebarItemData[]; activeKey?: string } {
    if (globalThis.window === undefined) return { items: [], activeKey: undefined }
    try {
      const rawActive = globalThis.sessionStorage?.getItem(STORAGE.active) ?? null
      return { items: [], activeKey: rawActive ?? undefined }
    } catch {
      return { items: [], activeKey: undefined }
    }
  }

  const initial = getInitial()
  const [items, setItems] = useState<SidebarItemData[]>(initial.items)
  const [activeKey, setActiveKey] = useState<string | undefined>(initial.activeKey)

  const setActiveKeyWithPersist = useCallback((key?: string) => {
    setActiveKey(key)
    try {
      if (key === undefined) globalThis.sessionStorage?.removeItem(STORAGE.active)
      else globalThis.sessionStorage?.setItem(STORAGE.active, key)
    } catch {}
  }, [])

  const value = useMemo(
    () => ({ items, setItems, activeKey, setActiveKey: setActiveKeyWithPersist }),
    [items, activeKey, setItems, setActiveKeyWithPersist]
  )
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
  return ctx
}




