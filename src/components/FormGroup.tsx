import React from 'react'
import clsx from 'clsx'

export type FormGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  label?: string
  error?: string | null
  help?: string | null
}

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
  const describedById = error ? errorId : help ? helpId : undefined

  return (
    <div {...rest} className={clsx('not-prose space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <FormFieldContext.Provider value={{ describedById, invalid: !!error }}>
        <div className="space-y-2">
          {children}
        </div>
      </FormFieldContext.Provider>

      {error ? (
        <p id={errorId} className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : help ? (
        <p id={helpId} className="text-sm text-gray-500 dark:text-gray-400">{help}</p>
      ) : null}
    </div>
  )
}

export type FormFieldContextValue = { describedById?: string; invalid?: boolean }
export const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)


