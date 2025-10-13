import React from 'react'
import clsx from 'clsx'

export type FormInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'placeholder'> & {
  label?: string
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
  required?: boolean
  error?: string | null
  help?: string | null
}

export default function FormInput({
  label,
  type = 'text',
  placeholder = '',
  required = false,
  error,
  help,
  className,
  id,
  ...rest
}: FormInputProps) {
  const reactId = React.useId()
  const inputId = id ?? `inp-${reactId}`
  const helpId = `${inputId}-help`
  const errorId = `${inputId}-error`

  const baseClasses = 'block w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2'
  const errorClasses = 'border border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
  const normalClasses = 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-700 focus:ring-blue-500 focus:border-transparent'

  const inputClasses = clsx(baseClasses, error ? errorClasses : normalClasses, className)

  return (
    <div className="not-prose space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 dark:text-red-400">*</span>}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        required={required}
        className={inputClasses}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : help ? helpId : undefined}
        {...rest}
      />

      {error ? (
        <p id={errorId} className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : help ? (
        <p id={helpId} className="text-sm text-gray-500 dark:text-gray-400">{help}</p>
      ) : null}
    </div>
  )
}


