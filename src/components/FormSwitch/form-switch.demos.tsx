import React from 'react'
import FormSwitch from '@/components/FormSwitch'

export function FormSwitchBasicDemo() {
  return (
    <div className="grid gap-4">
      <FormSwitch label="Nhận thông báo" help="Bạn có thể tắt mở bất kỳ lúc nào" />
      <FormSwitch label="Mặc định bật" defaultChecked />
    </div>
  )
}

export function FormSwitchControlledDemo() {
  const [on, setOn] = React.useState<boolean>(false)
  return (
    <div className="grid gap-4">
      <FormSwitch
        label={on ? 'Đang bật' : 'Đang tắt'}
        checked={on}
        onCheckedChange={setOn}
        help="Ví dụ controlled"
      />
    </div>
  )
}


