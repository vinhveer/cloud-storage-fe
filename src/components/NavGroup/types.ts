import type React from 'react'

export type NavItem = {
  id: string
  label: string
  href?: string
  icon?: string
  badge?: string | number
}

export type NavGroupProps = React.HTMLAttributes<HTMLElement> & {
  items?: NavItem[]
  activeItem?: string | null
  orientation?: 'horizontal' | 'vertical'
  onItemClick?: (item: NavItem) => void
}


