export type ControlSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export const buttonToSpinnerSize: Record<ControlSize, ControlSize> = {
  sm: 'md',
  md: 'lg',
  lg: 'xl',
  xl: '2xl',
  '2xl': '2xl',
}


