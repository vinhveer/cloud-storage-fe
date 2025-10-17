import React from 'react'
import FormInput from '@/components/FormGroup/FormInput/FormInput'

export function FormInputBasicDemo() {
  return (
    <div className="grid gap-4">
      <FormInput label="Họ tên" placeholder="Nguyễn Văn A" />
      <FormInput label="Email" type="email" placeholder="you@example.com" required />
    </div>
  )
}

export function FormInputTypesDemo() {
  return (
    <div className="grid gap-4">
      <FormInput label="Mật khẩu" type="password" placeholder="••••••••" />
      <FormInput label="Số" type="number" placeholder="123" />
    </div>
  )
}

export function FormInputStatesDemo() {
  const [value, setValue] = React.useState('')
  return (
    <div className="grid gap-4">
      <FormInput
        label="Controlled"
        placeholder="Nhập gì đó"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        help="Ví dụ controlled"
      />
      <FormInput label="Có lỗi" placeholder="Sai định dạng" error="Vui lòng nhập đúng định dạng" />
    </div>
  )
}


