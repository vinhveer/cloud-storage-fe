import type React from 'react'

export type StorageUsageProps = React.HTMLAttributes<HTMLDivElement> & {
  used: number
  total: number
  precision?: number
  colorClassName?: string
}


