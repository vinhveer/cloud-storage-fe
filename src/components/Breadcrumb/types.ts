import type React from 'react'

export type BreadcrumbItem = {
  id?: string
  label: string
  href?: string
  iconLeft?: React.ReactNode
}

export type BreadcrumbProps = {
  items: BreadcrumbItem[]
  className?: string
  separatorIconClassName?: string
  onItemClick?: (item: BreadcrumbItem, index: number) => void
}

export type UseBreadcrumbOptions = {
  items: BreadcrumbItem[]
}


