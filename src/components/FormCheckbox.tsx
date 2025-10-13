import React from 'react'
import clsx from 'clsx'

export type FormCheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string
  required?: boolean
  error?: string | null
  help?: string | null
}

export type UseFormCheckboxParams = Pick<FormCheckboxProps, 'required' | 'error' | 'help' | 'className' | 'id'>

export function useFormCheckbox({ required, error, help, className, id }: UseFormCheckboxParams) {
  const reactId = React.useId()
  const inputId = id ?? `chk-${reactId}`
  const helpId = `${inputId}-help`
  const errorId = `${inputId}-error`

  const baseClasses = 'w-5 h-5 rounded-[20%] border-2 transition-all duration-200 bg-white dark:bg-gray-700 accent-blue-600 dark:accent-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
  const normalClasses = 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-blue-500'
  const errorClasses = 'border-red-300 dark:border-red-600 focus:ring-red-500'
  const inputClasses = clsx(baseClasses, error ? errorClasses : normalClasses, className)

  const ariaDescribedBy = error ? errorId : help ? helpId : undefined

  const validateRequired = (checked: boolean, message = 'Trường này là bắt buộc'): string | null => {
    if (required && !checked) return message
    return null
  }

  return { inputId, helpId, errorId, inputClasses, ariaDescribedBy, validateRequired }
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
  const { inputId, helpId, errorId, inputClasses, ariaDescribedBy } = useFormCheckbox({
    required,
    error,
    help,
    className,
    id,
  })

  return (
    <div className="not-prose space-y-2">
      <div className="flex items-center space-x-3">
        <input
          id={inputId}
          type="checkbox"
          required={required}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          {...rest}
        />

        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
            {label}
            {required && <span className="text-red-500 dark:text-red-400">*</span>}
          </label>
        )}
      </div>

      {error ? (
        <p id={errorId} className="text-sm text-red-600 dark:text-red-400 ml-8">
          {error}
        </p>
      ) : help ? (
        <p id={helpId} className="text-sm text-gray-500 dark:text-gray-400 ml-8">
          {help}
        </p>
      ) : null}
    </div>
  )
}


