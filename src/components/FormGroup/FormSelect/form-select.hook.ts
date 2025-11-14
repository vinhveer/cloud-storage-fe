import React from 'react'
import clsx from 'clsx'
import { FormFieldContext } from '@/components/FormGroup/FormGroup'

export function useFormSelect({ className, id }: { className?: string; id?: string }) {
  const reactId = React.useId()
  const selectId = id ?? `sel-${reactId}`
  const field = React.useContext(FormFieldContext)

  const baseClasses = 'formselect-base'
  const errorClasses = 'formselect-error'
  const normalClasses = 'formselect-normal'

  const selectClasses = clsx(baseClasses, field?.invalid ? errorClasses : normalClasses, className)

  const ariaInvalid = field?.invalid
  const ariaDescribedBy = field?.describedById

  return { selectId, selectClasses, ariaInvalid, ariaDescribedBy }
}


