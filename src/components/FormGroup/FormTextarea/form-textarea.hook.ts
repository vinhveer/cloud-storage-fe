import React from 'react'
import clsx from 'clsx'
import { FormFieldContext } from '@/components/FormGroup/FormGroup'
import type { UseFormTextareaParams } from '@/components/FormGroup/FormTextarea/types'

export function useFormTextarea({ id, className, rich }: UseFormTextareaParams) {
  const reactId = React.useId()
  const textareaId = id ?? `txt-${reactId}`
  const field = React.useContext(FormFieldContext)

  const baseClasses = 'formtextarea-base'
  const errorClasses = 'formtextarea-error'
  const normalClasses = 'formtextarea-normal'

  const stateClass = field?.invalid ? errorClasses : normalClasses

  const textareaClasses = rich
    ? clsx('p-0 border-0', className)
    : clsx(baseClasses, stateClass, className)

  const ariaInvalid = field?.invalid
  const ariaDescribedBy = field?.describedById

  return { textareaId, textareaClasses, ariaInvalid, ariaDescribedBy }
}


