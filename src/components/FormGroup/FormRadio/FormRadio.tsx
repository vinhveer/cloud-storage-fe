import type { FormRadioProps } from '@/components/FormGroup/FormRadio/types'
import { useFormRadio } from '@/components/FormGroup/FormRadio/form-radio.hook'

export default function FormRadio({
  options = [],
  name = 'radio',
  className,
  inputClassName,
  children,
  ...rest
}: FormRadioProps) {
  const { rootClassName, listAriaDescribedBy, inputBaseClass, getOptionId } = useFormRadio({
    className,
    inputClassName,
    name,
  })

  return (
    <div {...rest} className={rootClassName}>
      <div className="formradio-list" aria-describedby={listAriaDescribedBy}>
        {options.map((opt, idx) => {
          const id = getOptionId(idx)
          return (
            <div key={id} className="formradio-row">
              <input
                id={id}
                type="radio"
                name={name}
                value={opt.value}
                disabled={opt.disabled}
                className={inputBaseClass}
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


