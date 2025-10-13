import React from 'react'
import clsx from 'clsx'

export type FormTextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'placeholder' | 'rows'> & {
  label?: string
  placeholder?: string
  required?: boolean
  error?: string | null
  help?: string | null
  rows?: number
}

export default function FormTextarea({
  label,
  placeholder = '',
  required = false,
  error,
  help,
  rows = 4,
  className,
  id,
  children,
  ...rest
}: FormTextareaProps) {
  const reactId = React.useId()
  const textareaId = id ?? `txt-${reactId}`
  const helpId = `${textareaId}-help`
  const errorId = `${textareaId}-error`

  const baseClasses = 'block w-full px-4 py-3 rounded-lg text-sm resize-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2'
  const errorClasses = 'border border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
  const normalClasses = 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-700 focus:ring-blue-500 focus:border-transparent'

  const textareaClasses = clsx(baseClasses, error ? errorClasses : normalClasses, className)

  return (
    <div className="not-prose space-y-2">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 dark:text-red-400">*</span>}
        </label>
      )}

      <textarea
        id={textareaId}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className={textareaClasses}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : help ? helpId : undefined}
        {...rest}
      >{children}</textarea>

      {error ? (
        <p id={errorId} className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : help ? (
        <p id={helpId} className="text-sm text-gray-500 dark:text-gray-400">{help}</p>
      ) : null}
    </div>
  )
}


