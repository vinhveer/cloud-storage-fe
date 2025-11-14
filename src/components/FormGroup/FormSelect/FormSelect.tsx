import type { FormSelectProps } from '@/components/FormGroup/FormSelect/types'
import { useFormSelect } from '@/components/FormGroup/FormSelect/form-select.hook'

export default function FormSelect({
  options = [],
  className,
  id,
  children,
  ...rest
}: FormSelectProps) {
  const { selectId, selectClasses, ariaInvalid, ariaDescribedBy } = useFormSelect({ className, id })

  return (
    <select
      id={selectId}
      className={selectClasses}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedBy}
      {...rest}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
      {children}
    </select>
  )
}


