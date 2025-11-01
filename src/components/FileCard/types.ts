import type { CSSProperties } from 'react'

export type IconName =
  | 'file'
  | 'file-alt'
  | 'file-csv'
  | 'file-image'
  | 'file-word'
  | 'file-excel'
  | 'file-pdf'
  | 'file-lines'
  | 'folder'

export type FileCardProps = React.HTMLAttributes<HTMLDivElement> & {
  icon?: IconName
  iconColor?: string
  title: string
  subtitle?: string
  detailsHref?: string
  width?: number
  style?: CSSProperties
}


