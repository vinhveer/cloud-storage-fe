import React from 'react'
import { Link } from '@tanstack/react-router'
import FormCard from '@/components/FormCard/FormCard'
import FormGroup from '@/components/FormGroup/FormGroup'
import FormInput from '@/components/FormGroup/FormInput/FormInput'

export default function RegisterPage() {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  function handleRegister() {
    // TODO: integrate auth later
    // eslint-disable-next-line no-console
    console.log({ name, email, password, confirmPassword })
  }

  return (
    <FormCard
      title="Đăng ký"
      subtitle="Tạo tài khoản mới"
      submitText="Đăng ký"
      onSubmitClick={handleRegister}
      footer={(
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Đã có tài khoản?{' '}
          <Link to="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline">Đăng nhập</Link>
        </p>
      )}
    >
      <div className="space-y-4">
        <FormGroup label="Họ tên">
          <FormInput
            placeholder="Nguyễn Văn A"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup label="Email">
          <FormInput
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup label="Mật khẩu">
          <FormInput
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup label="Nhập lại mật khẩu">
          <FormInput
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </FormGroup>
      </div>
    </FormCard>
  )
}


