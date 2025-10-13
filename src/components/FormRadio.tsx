import React from 'react'
import clsx from 'clsx'
import { FormFieldContext } from '@/components/FormGroup'

export type RadioOption = { value: string; label: string; disabled?: boolean }

export type FormRadioProps = React.HTMLAttributes<HTMLDivElement> & {
  options?: RadioOption[]
  name?: string
  inputClassName?: string
}

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
    <div {...rest} className={clsx('not-prose space-y-2', className)}>
      <div className="space-y-2" aria-describedby={field?.describedById}>
        {options.map((opt, idx) => {
          const id = `${name}-${reactId}-${idx}`
          return (
            <div key={id} className="flex items-center space-x-3">
              <input
                id={id}
                type="radio"
                name={name}
                value={opt.value}
                disabled={opt.disabled}
                className={clsx((() => {
                  const base = 'w-5 h-5 text-blue-600 focus:ring-2 transition-all duration-200'
                  const errorCls = 'border-red-300 dark:border-red-600 focus:ring-red-500'
                  const normalCls = 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-blue-500'
                  return clsx(base, field?.invalid ? errorCls : normalCls)
                })(), inputClassName)}
                aria-invalid={field?.invalid}
              />
              <label htmlFor={id} className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
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


