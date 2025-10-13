import React from 'react'
import clsx from 'clsx'

export type SelectOption = { value: string; label: string; disabled?: boolean }

export type FormSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  required?: boolean
  error?: string | null
  help?: string | null
  options?: SelectOption[]
}

export default function FormSelect({
  label,
  required = false,
  error,
  help,
  options = [],
  className,
  id,
  children,
  ...rest
}: FormSelectProps) {
  const reactId = React.useId()
  const selectId = id ?? `sel-${reactId}`
  const helpId = `${selectId}-help`
  const errorId = `${selectId}-error`

  return (
    <div className="not-prose space-y-2">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <select
        id={selectId}
        required={required}
        className={clsx(
          'block w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white',
          error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : help ? helpId : undefined}
        {...rest}
      >
        {!required && <option value="">Choose an option...</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
        {children}
      </select>

      {error ? (
        <p id={errorId} className="text-sm text-red-600">{error}</p>
      ) : help ? (
        <p id={helpId} className="text-sm text-gray-500">{help}</p>
      ) : null}
    </div>
  )
}


