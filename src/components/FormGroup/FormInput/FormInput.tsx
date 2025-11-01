import React from 'react'
import clsx from 'clsx'
import { FormFieldContext } from '@/components/FormGroup/FormGroup'
import type { FormInputProps } from '@/components/FormGroup/FormInput/types'

export default function FormInput({
  type = 'text',
  placeholder = '',
  className,
  id,
  ...rest
}: FormInputProps) {
  const reactId = React.useId()
  const inputId = id ?? `inp-${reactId}`
  const field = React.useContext(FormFieldContext)

  const baseClasses = 'forminput-base'
  const errorClasses = 'forminput-error'
  const normalClasses = 'forminput-normal'

  const inputClasses = clsx(baseClasses, field?.invalid ? errorClasses : normalClasses, className)

  return (
    <input
      id={inputId}
      type={type}
      placeholder={placeholder}
      className={inputClasses}
      aria-invalid={field?.invalid}
      aria-describedby={field?.describedById}
      {...rest}
    />
  )
}


