import type React from 'react'
export type SelectOption = { value: string; label: string; disabled?: boolean }

export type FormSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options?: SelectOption[]
}