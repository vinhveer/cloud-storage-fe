import React from 'react'
import clsx from 'clsx'
import { FormFieldContext } from '@/components/FormGroup/FormGroup'

export function useFormInput({ className, id }: { className?: string; id?: string }) {
  const reactId = React.useId()
  const inputId = id ?? `inp-${reactId}`
  const field = React.useContext(FormFieldContext)

  const baseClasses = 'forminput-base'
  const errorClasses = 'forminput-error'
  const normalClasses = 'forminput-normal'

  const inputClasses = clsx(baseClasses, field?.invalid ? errorClasses : normalClasses, className)

  const ariaInvalid = field?.invalid
  const ariaDescribedBy = field?.describedById

  return { inputId, inputClasses, ariaInvalid, ariaDescribedBy }
}


