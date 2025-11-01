import type React from 'react'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  icon?: React.ReactNode
  value?: string
  isLoading?: boolean
  loadingText?: string
}

export type ButtonContentProps = Pick<
  ButtonProps,
  'icon' | 'value' | 'children' | 'isLoading' | 'loadingText' | 'size'
>


