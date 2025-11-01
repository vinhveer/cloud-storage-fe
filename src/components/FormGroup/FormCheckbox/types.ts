import type React from 'react'

export type FormCheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string
  required?: boolean
  error?: string | null
  help?: string | null
}

export type UseFormCheckboxParams = Pick<FormCheckboxProps, 'required' | 'error' | 'help' | 'className' | 'id'>


