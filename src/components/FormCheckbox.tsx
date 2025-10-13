import React from 'react'
import clsx from 'clsx'

export type FormCheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string
  required?: boolean
  error?: string | null
  help?: string | null
}

export default function FormCheckbox({
  label,
  required = false,
  error,
  help,
  className,
  id,
  ...rest
}: FormCheckboxProps) {
  const reactId = React.useId()
  const inputId = id ?? `chk-${reactId}`

  return (
    <div className="not-prose space-y-2">
      <div className="flex items-center space-x-3">
        <input
          id={inputId}
          type="checkbox"
          required={required}
          className={clsx(
            'w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200',
            error && 'border-red-300 focus:ring-red-500',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : help ? `${inputId}-help` : undefined}
          {...rest}
        />

        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700 cursor-pointer">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="text-sm text-red-600 ml-8">
          {error}
        </p>
      ) : help ? (
        <p id={`${inputId}-help`} className="text-sm text-gray-500 ml-8">
          {help}
        </p>
      ) : null}
    </div>
  )
}


