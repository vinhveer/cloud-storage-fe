import React from 'react'
import clsx from 'clsx'
import { FormFieldContext } from '@/components/FormGroup/FormGroup'
import type { FormTextareaProps } from '@/components/FormGroup/FormTextarea/types'

export default function FormTextarea({
  placeholder = '',
  rows = 4,
  className,
  id,
  children,
  ...rest
}: FormTextareaProps) {
  const reactId = React.useId()
  const textareaId = id ?? `txt-${reactId}`
  const field = React.useContext(FormFieldContext)

  const baseClasses = 'formtextarea-base'
  const errorClasses = 'formtextarea-error'
  const normalClasses = 'formtextarea-normal'

  const textareaClasses = clsx(baseClasses, field?.invalid ? errorClasses : normalClasses, className)

  return (
    <textarea
      id={textareaId}
      rows={rows}
      placeholder={placeholder}
      className={textareaClasses}
      aria-invalid={field?.invalid}
      aria-describedby={field?.describedById}
      {...rest}
    >{children}</textarea>
  )
}


