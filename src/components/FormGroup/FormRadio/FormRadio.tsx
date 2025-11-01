import React from 'react'
import clsx from 'clsx'
import { FormFieldContext } from '@/components/FormGroup/FormGroup'
import type { FormRadioProps } from '@/components/FormGroup/FormRadio/types'

export default function FormRadio({
  options = [],
  name = 'radio',
  className,
  inputClassName,
  children,
  ...rest
}: FormRadioProps) {
  const reactId = React.useId()
  const field = React.useContext(FormFieldContext)

  return (
    <div {...rest} className={clsx('formradio-root', className)}>
      <div className="formradio-list" aria-describedby={field?.describedById}>
        {options.map((opt, idx) => {
          const id = `${name}-${reactId}-${idx}`
          return (
            <div key={id} className="formradio-row">
              <input
                id={id}
                type="radio"
                name={name}
                value={opt.value}
                disabled={opt.disabled}
                className={clsx((() => {
                  const base = 'formradio-input-base'
                  const errorCls = 'formradio-input-error'
                  const normalCls = 'formradio-input-normal'
                  return clsx(base, field?.invalid ? errorCls : normalCls)
                })(), inputClassName)}
                aria-invalid={field?.invalid}
              />
              <label htmlFor={id} className="formradio-label">
                {opt.label}
              </label>
            </div>
          )
        })}

        {children}
      </div>
    </div>
  )
}


