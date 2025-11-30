import FormCard from '@/components/FormCard/FormCard'
import FormGroup from '@/components/FormGroup/FormGroup'
import FormInput from '@/components/FormGroup/FormInput/FormInput'
import { Button } from '@/components/Button/Button'
import { useRegisterForm } from './hooks/useRegisterForm'
import PasswordInput from './components/PasswordInput'
import AuthFormFooter from './components/AuthFormFooter'

export default function RegisterPage() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleRegister,
    isPending,
  } = useRegisterForm()

  return (
    <FormCard
      title="Register"
      subtitle="Create a new account"
      footer={(
        <AuthFormFooter
          text="Already have an account?"
          linkText="Login"
          linkTo="/auth/login"
        />
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
          <PasswordInput
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup label="Confirm Password">
          <PasswordInput
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
            isLoading={isPending}
            loadingText="Registering..."
            disabled={isPending}
          >
            Register
          </Button>
        </div>
      </div>
    </FormCard>
  )
}



