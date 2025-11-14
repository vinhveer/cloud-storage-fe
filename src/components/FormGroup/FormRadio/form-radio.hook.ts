import React from 'react'
import clsx from 'clsx'
import { FormFieldContext } from '@/components/FormGroup/FormGroup'
import type { UseFormRadioParams } from '@/components/FormGroup/FormRadio/types'

export function useFormRadio({ className, inputClassName, name = 'radio' }: UseFormRadioParams) {
  const reactId = React.useId()
  const field = React.useContext(FormFieldContext)

  const rootClassName = clsx('formradio-root', className)
  const listAriaDescribedBy = field?.describedById

  const inputBaseClass = clsx(
    'formradio-input-base',
    field?.invalid ? 'formradio-input-error' : 'formradio-input-normal',
    inputClassName
  )

  const getOptionId = (index: number) => `${name}-${reactId}-${index}`

  return { rootClassName, listAriaDescribedBy, inputBaseClass, getOptionId }
}


