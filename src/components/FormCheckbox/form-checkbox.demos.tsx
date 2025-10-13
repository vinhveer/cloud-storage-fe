import React from 'react'
import FormCheckbox from '@/components/FormCheckbox'

export function FormCheckboxBasicDemo() {
  return (
    <div className="grid gap-4">
      <FormCheckbox label="Tôi đồng ý với điều khoản" />
      <FormCheckbox label="Nhận email khuyến mãi" />
      <FormCheckbox label="Bắt buộc" required />
    </div>
  )
}

export function FormCheckboxStatesDemo() {
  return (
    <div className="grid gap-4">
      <FormCheckbox label="Có lỗi" error="Bạn phải đồng ý" />
      <FormCheckbox label="Có trợ giúp" help="Bạn có thể thay đổi cài đặt sau." />
      <FormCheckbox label="Disabled" disabled />
    </div>
  )
}

export function FormCheckboxControlledDemo() {
  const [checked, setChecked] = React.useState(false)
  return (
    <div className="grid gap-4">
      <FormCheckbox
        label={checked ? 'Đã bật' : 'Đã tắt'}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        help="Ví dụ controlled với state"
      />
    </div>
  )
}


