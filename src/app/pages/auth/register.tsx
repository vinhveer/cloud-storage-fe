import React from 'react'
import { Link } from '@tanstack/react-router'
import FormCard from '@/components/FormCard/FormCard'
import FormGroup from '@/components/FormGroup/FormGroup'
import FormInput from '@/components/FormGroup/FormInput/FormInput'
import { Button } from '@/components/Button/Button'
import { useRegister } from '@/api/features/auth/auth.mutations'
import { AppError } from '@/api/core/error'
import { useAlert } from '@/components/Alert'
import { useNavigate } from '@tanstack/react-router'

export default function RegisterPage() {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const registerMutation = useRegister()
  const { showAlert } = useAlert()
  const navigate = useNavigate()

  function passwordsMatch() {
    return password === confirmPassword
  }

  async function handleRegister() {
    if (registerMutation.isPending) {
      return
    }

    if (!passwordsMatch()) {
      showAlert({
        type: 'error',
        message: 'Password confirmation does not match.',
        duration: 5000
      })
      return
    }

    try {
      const response = await registerMutation.mutateAsync({
        name,
        email,
        password,
        passwordConfirmation: confirmPassword,
      })

      // Save email to sessionStorage for verify-email page
      if (globalThis.window) {
        try {
          globalThis.window.sessionStorage.setItem('cloud-storage.lastRegisterEmail', email)
        } catch {
          // ignore storage errors
        }
      }

      showAlert({
        type: 'success',
        heading: 'Registration Successful',
        message: response.message || 'Registration successful. Please check your email to verify your account.',
        duration: 3000
      })

      // Redirect to verify-email page after short delay
      setTimeout(() => {
        navigate({ to: '/auth/verify-email' })
      }, 1000)
    } catch (unknownError) {
      const applicationError = unknownError as AppError
      showAlert({
        type: 'error',
        heading: 'Registration Failed',
        message: applicationError.message || 'Registration failed, please try again.',
        duration: 0
      })
    }
  }

  return (
    <FormCard
      title="Register"
      subtitle="Create a new account"
      footer={(
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline">Login</Link>
        </p>
      )}
    >
      <div className="space-y-4">
        <FormGroup label="Full Name">
          <FormInput
            placeholder="John Doe"
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

        <FormGroup label="Password">
          <FormInput
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup label="Confirm Password">
          <FormInput
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </FormGroup>

        <div className="pt-2">
          <Button
            onClick={handleRegister}
            variant="primary"
            size="lg"
            isLoading={registerMutation.isPending}
            loadingText="Registering..."
            disabled={!name || !email || !password || !confirmPassword}
          >
            Register
          </Button>
        </div>
      </div>
    </FormCard >
  )
}



