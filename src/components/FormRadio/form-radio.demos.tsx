import React from 'react'
import FormRadio from '@/components/FormRadio'

export function FormRadioBasicDemo() {
  return (
    <FormRadio
      label="Giới tính"
      name="gender-basic"
      options={[
        { value: 'male', label: 'Nam' },
        { value: 'female', label: 'Nữ' },
      ]}
    />
  )
}

export function FormRadioStatesDemo() {
  return (
    <div className="grid gap-4">
      <FormRadio
        label="Tùy chọn có lỗi"
        name="with-error"
        error="Vui lòng chọn một giá trị"
        options={[
          { value: 'a', label: 'Lựa chọn A' },
          { value: 'b', label: 'Lựa chọn B' },
        ]}
      />
      <FormRadio
        label="Tùy chọn có trợ giúp"
        name="with-help"
        help="Bạn có thể thay đổi sau"
        options={[
          { value: 'x', label: 'Lựa chọn X' },
          { value: 'y', label: 'Lựa chọn Y' },
        ]}
      />
    </div>
  )
}

export function FormRadioCustomDemo() {
  return (
    <FormRadio
      label="Kích thước lớn"
      name="custom-size"
      inputClassName="w-6 h-6"
      options={[
        { value: '1', label: 'Một' },
        { value: '2', label: 'Hai' },
      ]}
    />
  )
}


