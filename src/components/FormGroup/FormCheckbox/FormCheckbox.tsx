import React from 'react'
import clsx from 'clsx'
import type { FormCheckboxProps, UseFormCheckboxParams } from '@/components/FormGroup/FormCheckbox/types'

export function useFormCheckbox({ required, error, help, className, id }: UseFormCheckboxParams) {
  const reactId = React.useId()
  const inputId = id ?? `chk-${reactId}`
  const helpId = `${inputId}-help`
  const errorId = `${inputId}-error`

  const baseClasses = 'checkbox-base'
  const normalClasses = 'checkbox-normal'
  const errorClasses = 'checkbox-error'
  const inputClasses = clsx(baseClasses, error ? errorClasses : normalClasses, className)

  const ariaDescribedBy = error ? errorId : help ? helpId : undefined

  const validateRequired = (checked: boolean, message = 'Trường này là bắt buộc'): string | null => {
    if (required && !checked) return message
    return null
  }

  return { inputId, helpId, errorId, inputClasses, ariaDescribedBy, validateRequired }
}

export default function FormCheckbox({
  label,
  required = false,
  error,
  help,
  className,
  id,
  ...rest
}: FormCheckboxProps) {
  const { inputId, helpId, errorId, inputClasses, ariaDescribedBy } = useFormCheckbox({
    required,
    error,
    help,
    className,
    id,
  })

  return (
    <div className="checkbox-root">
      <div className="checkbox-row">
        <input
          id={inputId}
          type="checkbox"
          required={required}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          {...rest}
        />

        {label && (
          <label htmlFor={inputId} className="checkbox-label">
            {label}
            {required && <span className="checkbox-required">*</span>}
          </label>
        )}
      </div>

      {error ? (
        <p id={errorId} className="checkbox-error-text">
          {error}
        </p>
      ) : help ? (
        <p id={helpId} className="checkbox-help-text">
          {help}
        </p>
      ) : null}
    </div>
  )
}


