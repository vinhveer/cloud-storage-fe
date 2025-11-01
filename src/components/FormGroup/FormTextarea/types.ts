import type React from 'react'

export type FormTextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'placeholder' | 'rows'> & {
  placeholder?: string
  rows?: number
}