import React from 'react'
import clsx from 'clsx'
import type { FormGroupProps, FormFieldContextValue } from '@/components/FormGroup/types'

export default function FormGroup({
  label,
  error,
  help,
  className,
  children,
  ...rest
}: FormGroupProps) {
  const reactId = React.useId()
  const helpId = `${reactId}-help`
  const errorId = `${reactId}-error`
  let describedById: string | undefined
  if (error) {
    describedById = errorId
  } else if (help) {
    describedById = helpId
  }

  const contextValue = React.useMemo(
    () => ({ describedById, invalid: !!error }),
    [describedById, error]
  )

  return (
    <div {...rest} className={clsx('not-prose space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <FormFieldContext.Provider value={contextValue}>
        <div className="space-y-0">
          {children}
        </div>
      </FormFieldContext.Provider>

      {error && (
        <p id={errorId} className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {!error && help && (
        <p id={helpId} className="text-sm text-gray-500 dark:text-gray-400">{help}</p>
      )}
    </div>
  )
}

export const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)