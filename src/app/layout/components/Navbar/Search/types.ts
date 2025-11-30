import type { ReactNode } from 'react'

export type SearchResult = {
  id: string
  url: string
  title: string
  description?: string
  icon?: ReactNode
}

export type SearchProps = {
  onSearch?: (query: string) => Promise<SearchResult[]>
  placeholder?: string
  className?: string
}


