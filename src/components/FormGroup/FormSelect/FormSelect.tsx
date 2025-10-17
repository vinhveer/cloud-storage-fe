import React from 'react'
import clsx from 'clsx'
import { FormFieldContext } from '@/components/FormGroup/FormGroup'

export type SelectOption = { value: string; label: string; disabled?: boolean }

export type FormSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options?: SelectOption[]
}

export default function FormSelect({
  options = [],
  className,
  id,
  children,
  ...rest
}: FormSelectProps) {
  const reactId = React.useId()
  const selectId = id ?? `sel-${reactId}`
  const field = React.useContext(FormFieldContext)

  const baseClasses = 'block w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 text-gray-900 dark:text-white focus:outline-none focus:ring-2'
  const errorClasses = 'border border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
  const normalClasses = 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-blue-500 focus:border-transparent'

  const selectClasses = clsx(baseClasses, field?.invalid ? errorClasses : normalClasses, className)

  return (
    <select
      id={selectId}
      className={selectClasses}
      aria-invalid={field?.invalid}
      aria-describedby={field?.describedById}
      {...rest}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
      {children}
    </select>
  )
}


