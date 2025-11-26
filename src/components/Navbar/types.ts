import type { ReactNode } from 'react'

export type NavbarSearchResult = {
  id: string
  url: string
  title: string
  description?: string
  icon?: ReactNode
}

export type NavbarProps = {
  title?: string
  onSearch?: (query: string) => Promise<NavbarSearchResult[]>
  searchPlaceholder?: string
  className?: string
  currentFolderId?: number | null
  onToggleSidebar?: () => void
}


