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

  return (
    <div className="not-prose space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        required={required}
        className={clsx(
          'block w-full px-4 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
          !error && 'bg-white focus:bg-white',
          error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : help ? helpId : undefined}
        {...rest}
      />

      {error ? (
        <p id={errorId} className="text-sm text-red-600">{error}</p>
      ) : help ? (
        <p id={helpId} className="text-sm text-gray-500">{help}</p>
      ) : null}
    </div>
  )
}


