import type React from 'react'

export type FormInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'placeholder'> & {
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
}


