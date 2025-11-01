import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { HomeIcon, FolderIcon, ShareIcon, TrashIcon } from '@heroicons/react/24/outline'

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
  const defaultItems: SidebarItemData[] = [
    { key: 'home', title: 'Home', href: '/', icon: <HomeIcon className="w-5 h-5" /> },
    { key: 'files', title: 'My Files', href: '#', icon: <FolderIcon className="w-5 h-5" /> },
    { key: 'shared', title: 'Shared', href: '#', icon: <ShareIcon className="w-5 h-5" /> },
    { key: 'trash', title: 'Trash', href: '#', icon: <TrashIcon className="w-5 h-5" /> },
  ]

  function sanitize(items: unknown): SidebarItemData[] | null {
    if (!Array.isArray(items)) return null
    return items
      .map((it: any) =>
        it && typeof it === 'object'
          ? ({ key: String(it.key), title: String(it.title), href: typeof it.href === 'string' ? it.href : undefined } as SidebarItemData)
          : null,
      )
      .filter(Boolean) as SidebarItemData[]
  }

  function getInitial(): { items: SidebarItemData[]; activeKey?: string } {
    if (typeof window === 'undefined') return { items: defaultItems, activeKey: undefined }
    try {
      const rawItems = localStorage.getItem('sidebar:items')
      const rawActive = localStorage.getItem('sidebar:activeKey')
      const parsed = rawItems ? JSON.parse(rawItems) : null
      const cleaned = sanitize(parsed)
      // Write back sanitized data to avoid future issues
      if (cleaned) try { localStorage.setItem('sidebar:items', JSON.stringify(cleaned)) } catch {}
      return { items: cleaned ?? defaultItems, activeKey: rawActive ?? undefined }
    } catch {
      return { items: defaultItems, activeKey: undefined }
    }
  }

  const initial = getInitial()
  const [items, setItemsState] = useState<SidebarItemData[]>(initial.items)
  const [activeKey, setActiveKeyState] = useState<string | undefined>(initial.activeKey)

  const setItems = useCallback((next: SidebarItemData[]) => {
    setItemsState(next)
    // Persist only serializable fields (no React nodes)
    const serializable = next.map(({ key, title, href }) => ({ key, title, href }))
    try { localStorage.setItem('sidebar:items', JSON.stringify(serializable)) } catch {}
  }, [])

  const setActiveKey = useCallback((key?: string) => {
    setActiveKeyState(key)
    try {
      if (key === undefined) localStorage.removeItem('sidebar:activeKey')
      else localStorage.setItem('sidebar:activeKey', key)
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


