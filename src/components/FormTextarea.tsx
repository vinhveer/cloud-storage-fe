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

  return (
    <div className="not-prose space-y-2">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <textarea
        id={textareaId}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className={clsx(
          'block w-full px-4 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none',
          !error && 'bg-white focus:bg-white',
          error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : help ? helpId : undefined}
        {...rest}
      >{children}</textarea>

      {error ? (
        <p id={errorId} className="text-sm text-red-600">{error}</p>
      ) : help ? (
        <p id={helpId} className="text-sm text-gray-500">{help}</p>
      ) : null}
    </div>
  )
}


