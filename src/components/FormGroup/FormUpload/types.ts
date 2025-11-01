import type React from 'react'
export type FormUploadProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string
  required?: boolean
  error?: string | null
  help?: string | null
  accept?: string
  multiple?: boolean
  onFilesChange?: (files: File[]) => void
}


