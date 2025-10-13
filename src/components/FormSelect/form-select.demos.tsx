import React from 'react'
import FormSelect from '@/components/FormSelect'

export function FormSelectBasicDemo() {
  return (
    <div className="grid gap-4">
      <FormSelect
        label="Quốc gia"
        options={[
          { value: 'vn', label: 'Việt Nam' },
          { value: 'us', label: 'United States' },
        ]}
      />
      <FormSelect
        label="Thành phố"
        required
        options={[
          { value: 'hcm', label: 'TP.HCM' },
          { value: 'hn', label: 'Hà Nội' },
        ]}
      />
    </div>
  )
}

export function FormSelectStatesDemo() {
  const [value, setValue] = React.useState('')
  return (
    <div className="grid gap-4">
      <FormSelect
        label="Controlled"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        help="Ví dụ controlled"
        options={[
          { value: '', label: 'Choose...' },
          { value: '1', label: 'Một' },
          { value: '2', label: 'Hai' },
        ]}
      />
      <FormSelect
        label="Có lỗi"
        error="Vui lòng chọn một giá trị"
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
        ]}
      />
    </div>
  )
}


