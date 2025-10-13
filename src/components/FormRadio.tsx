import React from 'react'
import clsx from 'clsx'

export type RadioOption = { value: string; label: string; disabled?: boolean }

export type FormRadioProps = React.HTMLAttributes<HTMLDivElement> & {
  label?: string
  required?: boolean
  error?: string | null
  help?: string | null
  options?: RadioOption[]
  name?: string
  inputClassName?: string
}

export default function FormRadio({
  label,
  required = false,
  error,
  help,
  options = [],
  name = 'radio',
  className,
  inputClassName,
  children,
  ...rest
}: FormRadioProps) {
  const reactId = React.useId()
  const helpId = `${reactId}-help`
  const errorId = `${reactId}-error`

  return (
    <div {...rest} className={clsx('not-prose space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="space-y-2" aria-describedby={error ? errorId : help ? helpId : undefined}>
        {options.map((opt, idx) => {
          const id = `${name}-${reactId}-${idx}`
          return (
            <div key={id} className="flex items-center space-x-3">
              <input
                id={id}
                type="radio"
                name={name}
                value={opt.value}
                required={required}
                disabled={opt.disabled}
                className={clsx(
                  'w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2 transition-all duration-200',
                  error && 'border-red-300 focus:ring-red-500',
                  inputClassName
                )}
                aria-invalid={!!error}
              />
              <label htmlFor={id} className="text-sm text-gray-700 cursor-pointer">
                {opt.label}
              </label>
            </div>
          )
        })}

        {children}
      </div>

      {error ? (
        <p id={errorId} className="text-sm text-red-600">{error}</p>
      ) : help ? (
        <p id={helpId} className="text-sm text-gray-500">{help}</p>
      ) : null}
    </div>
  )
}


