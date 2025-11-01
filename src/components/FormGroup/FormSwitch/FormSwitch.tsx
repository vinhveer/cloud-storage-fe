import React from 'react'
import clsx from 'clsx'
import { FormFieldContext } from '@/components/FormGroup/FormGroup'
import type { FormSwitchProps } from '@/components/FormGroup/FormSwitch/types'
import { useFormSwitch } from '@/components/FormGroup/FormSwitch/formswitch.hook'

export default function FormSwitch({
  checked,
  defaultChecked,
  onCheckedChange,
  className,
  ...rest
}: FormSwitchProps) {
  const { isOn, toggle } = useFormSwitch({ checked, defaultChecked, onCheckedChange })
  const field = React.useContext(FormFieldContext)

  return (
    <div className={clsx('formswitch-root', className)}>
      <div className="formswitch-row">
        <button
          type="button"
          aria-pressed={isOn}
          onClick={toggle}
          className={clsx('formswitch-button', isOn ? 'formswitch-on' : 'formswitch-off')}
          aria-invalid={field?.invalid}
          {...rest}
        >
          <span className={clsx('formswitch-knob', isOn ? 'formswitch-knob-on' : 'formswitch-knob-off')} />
        </button>
      </div>
    </div>
  )
}


