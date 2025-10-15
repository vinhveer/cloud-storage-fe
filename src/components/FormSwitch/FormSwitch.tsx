import React from 'react'
import clsx from 'clsx'
import { FormFieldContext } from '@/components/FormGroup/FormGroup'

export type FormSwitchProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export default function FormSwitch({
  checked,
  defaultChecked,
  onCheckedChange,
  className,
  ...rest
}: FormSwitchProps) {
  const isControlled = typeof checked === 'boolean'
  const [internalChecked, setInternalChecked] = React.useState<boolean>(defaultChecked ?? false)
  const isOn = isControlled ? (checked as boolean) : internalChecked
  const field = React.useContext(FormFieldContext)

  const setOn = (next: boolean) => {
    if (!isControlled) setInternalChecked(next)
    onCheckedChange?.(next)
  }

  return (
    <div className={clsx('not-prose space-y-2', className)}>
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-pressed={isOn}
          onClick={() => setOn(!isOn)}
          className={clsx(
            'relative inline-flex h-6 w-11 items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
            isOn ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
          )}
          aria-invalid={field?.invalid}
          {...rest}
        >
          <span
            className={clsx(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out',
              isOn ? 'translate-x-2.5' : '-translate-x-2.5'
            )}
          />
        </button>
      </div>
    </div>
  )
}


