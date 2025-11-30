import type React from 'react'
export { Button as default } from './Button'
export { Button } from './Button'
export type ControlSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: ControlSize
  icon?: React.ReactNode
  value?: string
  isLoading?: boolean
  loadingText?: string
}

export type ButtonContentProps = Pick<
  ButtonProps,
  'icon' | 'value' | 'children' | 'isLoading' | 'loadingText' | 'size'
>

export const buttonToSpinnerSize: Record<ControlSize, ControlSize> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
  xl: 'md',
  '2xl': 'lg',
}
