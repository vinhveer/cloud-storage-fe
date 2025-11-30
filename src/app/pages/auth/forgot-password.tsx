import FormCard from '@/components/FormCard/FormCard'
import FormGroup from '@/components/FormGroup/FormGroup'
import FormInput from '@/components/FormGroup/FormInput/FormInput'
import { Button } from '@/components/Button/Button'
import { useForgotPasswordForm } from './hooks/useForgotPasswordForm'
import AuthFormFooter from './components/AuthFormFooter'

export default function ForgotPasswordPage() {
    const { email, setEmail, handleForgotPassword, isPending } = useForgotPasswordForm()

    return (
        <FormCard
            title="Forgot Password"
            subtitle="Enter your email to reset password"
            footer={(
                <AuthFormFooter
                    text="Remember your password?"
                    linkText="Login"
                    linkTo="/auth/login"
                />
            )}
        >
            <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    We will send you an email with instructions on how to reset your password.
                </p>

                <FormGroup label="Email">
                    <FormInput
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </FormGroup>

                <div className="pt-2">
                    <Button
                        onClick={handleForgotPassword}
                        variant="primary"
                        size="lg"
                        isLoading={isPending}
                        loadingText="Sending..."
                        disabled={isPending}
                    >
                        Send Reset Link
                    </Button>
                </div>
            </div>
        </FormCard>
    )
}
