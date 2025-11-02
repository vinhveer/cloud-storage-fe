import React from 'react'
import { Link } from '@tanstack/react-router'
import FormCard from '@/components/FormCard/FormCard'
import FormGroup from '@/components/FormGroup/FormGroup'
import FormInput from '@/components/FormGroup/FormInput/FormInput'

export default function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  function handleLogin() {
    // TODO: integrate auth later
    // eslint-disable-next-line no-console
    console.log({ email, password })
  }

  return (
    <FormCard
      title="Đăng nhập"
      subtitle="Chào mừng trở lại"
      submitText="Đăng nhập"
      onSubmitClick={handleLogin}
      footer={(
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Chưa có tài khoản?{' '}
          <Link to="/auth/register" className="text-blue-600 dark:text-blue-400 hover:underline">Đăng ký</Link>
        </p>
      )}
    >
      <div className="space-y-4">
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
      </div>
    </FormCard>
  )
}


