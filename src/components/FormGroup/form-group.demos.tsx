// import React from 'react'
import FormGroup from '@/components/FormGroup/FormGroup'
import FormUpload from '@/components/FormGroup/FormUpload/FormUpload'

export function FormGroupBasicDemo() {
  return (
    <FormGroup label="Thông tin cá nhân">
      <input className="border rounded px-3 py-2 w-full" placeholder="Họ tên" />
      <input className="border rounded px-3 py-2 w-full" placeholder="Email" />
    </FormGroup>
  )
}

export function FormGroupWithHelpDemo() {
  return (
    <FormGroup label="Tải lên" help="Chỉ nhận ảnh PNG/JPG">
      <FormUpload accept="image/png,image/jpeg" />
    </FormGroup>
  )
}


