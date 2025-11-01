import React from 'react'
import clsx from 'clsx'
import { FormFieldContext } from '@/components/FormGroup/FormGroup'
import type { FormSelectProps } from '@/components/FormGroup/FormSelect/types'

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

  const baseClasses = 'formselect-base'
  const errorClasses = 'formselect-error'
  const normalClasses = 'formselect-normal'

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


