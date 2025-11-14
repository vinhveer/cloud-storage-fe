import type React from 'react'

export type FormTextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'placeholder' | 'rows'> & {
  placeholder?: string
  rows?: number
  rich?: boolean
  height?: number
  onValueChange?: (value: string) => void
  editorInit?: Record<string, unknown>
}

export type UseFormTextareaParams = Pick<FormTextareaProps, 'id' | 'className' | 'rich'>