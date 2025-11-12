import React from 'react'

type Params = {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export function useFormSwitch({ checked, defaultChecked, onCheckedChange }: Params) {
  const isControlled = typeof checked === 'boolean'
  const [internalChecked, setInternalChecked] = React.useState<boolean>(defaultChecked ?? false)
  const isOn = isControlled ? Boolean(checked) : internalChecked

  const setOn = (next: boolean) => {
    if (!isControlled) setInternalChecked(next)
    onCheckedChange?.(next)
  }

  const toggle = () => setOn(!isOn)

  return { isOn, setOn, toggle }
}


