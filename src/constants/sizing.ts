export type ControlSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export const loadingSizePixels: Record<ControlSize, number> = {
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
  '2xl': 28,
}

export const buttonToSpinnerSize: Record<ControlSize, ControlSize> = {
  sm: 'md',
  md: 'lg',
  lg: 'xl',
  xl: '2xl',
  '2xl': '2xl',
}


