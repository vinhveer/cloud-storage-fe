import React from 'react'
import clsx from 'clsx'
import { FormFieldContext } from '@/components/FormGroup/FormGroup'

export type FormTextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'placeholder' | 'rows'> & {
  placeholder?: string
  rows?: number
}

export default function FormTextarea({
  placeholder = '',
  rows = 4,
  className,
  id,
  children,
  ...rest
}: FormTextareaProps) {
  const reactId = React.useId()
  const textareaId = id ?? `txt-${reactId}`
  const field = React.useContext(FormFieldContext)

  const baseClasses = 'block w-full px-4 py-3 rounded-lg text-sm resize-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2'
  const errorClasses = 'border border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
  const normalClasses = 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-700 focus:ring-blue-500 focus:border-transparent'

  const textareaClasses = clsx(baseClasses, field?.invalid ? errorClasses : normalClasses, className)

  return (
    <textarea
      id={textareaId}
      rows={rows}
      placeholder={placeholder}
      className={textareaClasses}
      aria-invalid={field?.invalid}
      aria-describedby={field?.describedById}
      {...rest}
    >{children}</textarea>
  )
}


