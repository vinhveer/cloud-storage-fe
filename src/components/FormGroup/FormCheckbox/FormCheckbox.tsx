import type { FormCheckboxProps } from '@/components/FormGroup/FormCheckbox/types'
import { useFormCheckbox } from '@/components/FormGroup/FormCheckbox/form-checkbox.hook'

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

      {error && (
        <p id={errorId} className="checkbox-error-text">
          {error}
        </p>
      )}
      {!error && help && (
        <p id={helpId} className="checkbox-help-text">
          {help}
        </p>
      )}
    </div>
  )
}


