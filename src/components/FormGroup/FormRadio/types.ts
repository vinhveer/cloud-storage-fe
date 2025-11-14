import type React from 'react'
export type RadioOption = { value: string; label: string; disabled?: boolean }

export type FormRadioProps = React.HTMLAttributes<HTMLDivElement> & {
  options?: RadioOption[]
  name?: string
  inputClassName?: string
}

export type UseFormRadioParams = Pick<FormRadioProps, 'className' | 'inputClassName' | 'name'>