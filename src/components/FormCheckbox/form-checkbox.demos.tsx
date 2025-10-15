import React from 'react'
import FormCheckbox, { useFormCheckbox } from '@/components/FormCheckbox/FormCheckbox'
import { Button } from '@/components/Button/Button'

export function FormCheckboxBasicDemo() {
  return (
    <div className="grid gap-6 mt-4">
      <FormCheckbox label="Tôi đồng ý với điều khoản" />
      <FormCheckbox label="Nhận email khuyến mãi" />
      <FormCheckbox label="Bắt buộc" required />
    </div>
  )
}

export function FormCheckboxStatesDemo() {
  return (
    <div className="grid gap-6 mt-4">
      <FormCheckbox label="Có lỗi" error="Bạn phải đồng ý" />
      <FormCheckbox label="Có trợ giúp" help="Bạn có thể thay đổi cài đặt sau." />
      <FormCheckbox label="Disabled" disabled />
    </div>
  )
}

export function FormCheckboxControlledDemo() {
  const [checked, setChecked] = React.useState(false)
  return (
    <div className="grid gap-6 mt-4">
      <FormCheckbox
        label={checked ? 'Đã bật' : 'Đã tắt'}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        help="Ví dụ controlled với state"
      />
    </div>
  )
}

export function FormCheckboxFormDemo() {
  const [error, setError] = React.useState<string | null>(null)
  const [checked, setChecked] = React.useState(false)
  const { validateRequired } = useFormCheckbox({ required: true })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = validateRequired(checked, 'Bạn phải đồng ý điều khoản trước khi gửi.')
    setError(msg)
    if (!msg) alert('Submitted!')
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormCheckbox
        label="Tôi đồng ý với điều khoản"
        required
        error={error}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <div className="pt-2">
        <Button type="submit" variant="primary">Gửi</Button>
      </div>
    </form>
  )
}


