import React from 'react'
import FormTextarea from '@/components/FormTextarea'

export function FormTextareaBasicDemo() {
  return (
    <div className="grid gap-4">
      <FormTextarea label="Ghi chú" placeholder="Nhập ghi chú..." />
      <FormTextarea label="Mô tả" rows={6} />
    </div>
  )
}

export function FormTextareaStatesDemo() {
  const [value, setValue] = React.useState('')
  return (
    <div className="grid gap-4">
      <FormTextarea
        label="Controlled"
        placeholder="Nhập nội dung"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        help="Ví dụ controlled"
      />
      <FormTextarea label="Có lỗi" error="Nội dung không hợp lệ" />
    </div>
  )
}


