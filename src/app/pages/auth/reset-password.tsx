import FormCard from '@/components/FormCard/FormCard'
import FormGroup from '@/components/FormGroup/FormGroup'
import { Button } from '@/components/Button/Button'
import { useResetPasswordForm } from './hooks/useResetPasswordForm'
import PasswordInput from './components/PasswordInput'
import AuthFormFooter from './components/AuthFormFooter'

export default function ResetPasswordPage() {
    const {
        token,
        emailParam,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        handleResetPassword,
        isPending,
    } = useResetPasswordForm()

    return (
        <FormCard
            title="Reset Password"
            subtitle="Enter your new password"
            footer={(
                <AuthFormFooter
                    text="Remember your password?"
                    linkText="Login"
                    linkTo="/auth/login"
                />
            )}
        >
            <div className="space-y-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Password must be 8-16 characters, contain at least one letter, one number, and one special character.
                </p>

                <input type="hidden" value={emailParam} />
                <input type="hidden" value={token} />

                <FormGroup label="New Password">
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
                        onClick={handleResetPassword}
                        variant="primary"
                        size="lg"
                        isLoading={isPending}
                        loadingText="Resetting..."
                        disabled={isPending}
                    >
                        Reset Password
                    </Button>
                </div>
            </div>
        </FormCard>
    )
}
