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

  return (
    <div {...rest} className={clsx('not-prose space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="space-y-2" aria-describedby={error ? errorId : help ? helpId : undefined}>
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


