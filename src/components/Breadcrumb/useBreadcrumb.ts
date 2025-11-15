import { useMemo } from 'react'
import type { BreadcrumbItem, UseBreadcrumbOptions } from '@/components/Breadcrumb/types'

export type BreadcrumbSegment = BreadcrumbItem & {
  isCurrent: boolean
  index: number
}

export function useBreadcrumb({ items }: UseBreadcrumbOptions) {
  const segments: BreadcrumbSegment[] = useMemo(() => {
    const lastIndex = items.length - 1
    return items.map((item, index) => ({
      ...item,
      index,
      isCurrent: index === lastIndex,
    }))
  }, [items])

  return {
    segments,
    hasItems: segments.length > 0,
  }
}


