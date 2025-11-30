import FormCard from '@/components/FormCard/FormCard'
import FormGroup from '@/components/FormGroup/FormGroup'
import FormInput from '@/components/FormGroup/FormInput/FormInput'
import { Button } from '@/components/Button/Button'
import { useVerifyEmailForm } from './hooks/useVerifyEmailForm'
import AuthFormFooter from './components/AuthFormFooter'

export default function VerifyEmailPage() {
  const { email, setEmail, handleResend, isPending } = useVerifyEmailForm()

  return (
    <FormCard
      title="Verify Email"
      subtitle="Complete the account verification step to continue using the service"
      footer={(
        <AuthFormFooter
          text="Already verified?"
          linkText="Back to login"
          linkTo="/auth/login"
        />
      )}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          We have sent an email containing a verification link to your email address.
          Please check your inbox (or Spam folder) and click on the link in the email to activate your account.
        </p>

        <FormGroup label="Email">
          <FormInput
            id="verify-email-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </FormGroup>

        <div className="pt-2">
          <Button
            onClick={handleResend}
            variant="primary"
            size="lg"
            isLoading={isPending}
            loadingText="Resending..."
            disabled={isPending}
          >
            Resend verification email
          </Button>
        </div>
      </div>
    </FormCard>
  )
}


