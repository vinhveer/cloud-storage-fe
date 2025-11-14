import React from 'react'
import clsx from 'clsx'
import type { UseFormCheckboxParams } from '@/components/FormGroup/FormCheckbox/types'

export function useFormCheckbox({ required, error, help, className, id }: UseFormCheckboxParams) {
  const reactId = React.useId()
  const inputId = id ?? `chk-${reactId}`
  const helpId = `${inputId}-help`
  const errorId = `${inputId}-error`

  const baseClasses = 'checkbox-base'
  const normalClasses = 'checkbox-normal'
  const errorClasses = 'checkbox-error'
  const inputClasses = clsx(baseClasses, error ? errorClasses : normalClasses, className)

  let ariaDescribedBy: string | undefined
  if (error) {
    ariaDescribedBy = errorId
  } else if (help) {
    ariaDescribedBy = helpId
  }

  const validateRequired = (checked: boolean, message = 'Trường này là bắt buộc'): string | null => {
    if (required && !checked) return message
    return null
  }

  return { inputId, helpId, errorId, inputClasses, ariaDescribedBy, validateRequired }
}


