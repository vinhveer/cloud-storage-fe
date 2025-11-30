import { Link } from '@tanstack/react-router'
import FormCard from '@/components/FormCard/FormCard'
import FormGroup from '@/components/FormGroup/FormGroup'
import FormInput from '@/components/FormGroup/FormInput/FormInput'
import { Button } from '@/components/Button/Button'
import { useLoginForm } from './hooks/useLoginForm'
import PasswordInput from './components/PasswordInput'
import AuthFormFooter from './components/AuthFormFooter'

export default function LoginPage() {
  const { email, setEmail, password, setPassword, showForgotPassword, handleLogin, isPending } = useLoginForm()

  return (
    <FormCard
      title="Login"
      subtitle="Welcome back"
      footer={(
        <div className="flex flex-col items-center gap-2">
          <AuthFormFooter
            text="Don't have an account?"
            linkText="Register"
            linkTo="/auth/register"
          />
          {showForgotPassword && (
            <Link to="/auth/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Forgot Password?
            </Link>
          )}
        </div>
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

        <FormGroup label="Password">
          <PasswordInput
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>

        <div className="pt-2">
          <Button
            onClick={handleLogin}
            variant="primary"
            size="lg"
            isLoading={isPending}
            loadingText="Logging in..."
            disabled={isPending}
          >
            Login
          </Button>
        </div>
      </div>
    </FormCard>
  )
}



