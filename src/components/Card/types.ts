import type React from 'react'

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string
  subtitle?: string
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  border?: boolean
}


