import type React from 'react'

export type SidebarItemData = {
  key: string
  title: string
  href?: string
  icon?: React.ReactNode
}

export type SidebarContextValue = {
  items: SidebarItemData[]
  setItems: (items: SidebarItemData[]) => void
  activeKey?: string
  setActiveKey: (key?: string) => void
}

export type SidebarProviderProps = Readonly<{
  children: React.ReactNode
}>

export type SidebarItemProps = {
  title: string
  href?: string
  to?: string
  isActive?: boolean
  icon?: React.ReactNode
}


