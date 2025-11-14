import type { FormInputProps } from '@/components/FormGroup/FormInput/types'
import { useFormInput } from '@/components/FormGroup/FormInput/form-input.hook'

export default function FormInput({
  type = 'text',
  placeholder = '',
  className,
  id,
  ...rest
}: FormInputProps) {
  const { inputId, inputClasses, ariaInvalid, ariaDescribedBy } = useFormInput({ className, id })

  return (
    <input
      id={inputId}
      type={type}
      placeholder={placeholder}
      className={inputClasses}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedBy}
      {...rest}
    />
  )
}


