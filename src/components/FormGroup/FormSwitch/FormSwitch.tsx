import clsx from 'clsx'
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

  return (
    <div className={clsx('formswitch-root', className)}>
      <div className="formswitch-row">
        <button
          type="button"
          aria-pressed={isOn}
          onClick={toggle}
          className={clsx('formswitch-button', isOn ? 'formswitch-on' : 'formswitch-off')}
          {...rest}
        >
          <span className={clsx('formswitch-knob', isOn ? 'formswitch-knob-on' : 'formswitch-knob-off')} />
        </button>
      </div>
    </div>
  )
}


