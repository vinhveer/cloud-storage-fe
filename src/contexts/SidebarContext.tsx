import { createContext, useContext, useMemo, useState } from 'react'
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

  const [items, setItems] = useState<SidebarItemData[]>(defaultItems)
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined)

  const value = useMemo(() => ({ items, setItems, activeKey, setActiveKey }), [items, activeKey])
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
  return ctx
}


