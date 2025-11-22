import React from 'react'
import { Link } from '@tanstack/react-router'
import FormCard from '@/components/FormCard/FormCard'
import FormGroup from '@/components/FormGroup/FormGroup'
import FormInput from '@/components/FormGroup/FormInput/FormInput'
import { Button } from '@/components/Button/Button'
import { useForgotPassword } from '@/api/features/auth/auth.mutations'
import { AppError } from '@/api/core/error'
import { useAlert } from '@/components/Alert'

export default function ForgotPasswordPage() {
    const [email, setEmail] = React.useState('')
    const forgotPasswordMutation = useForgotPassword()
    const { showAlert } = useAlert()

    async function handleForgotPassword() {
        if (forgotPasswordMutation.isPending) {
            return
        }

        try {
            const response = await forgotPasswordMutation.mutateAsync({ email })
            showAlert({
                type: 'success',
                heading: 'Email Sent',
                message: response.message || 'If an account exists for this email, you will receive password reset instructions.',
                duration: 5000
            })
            // Optional: redirect to login after success? Or just stay here?
            // Usually stay here or redirect to login. Let's stay for now or redirect after a delay.
        } catch (unknownError) {
            const applicationError = unknownError as AppError
            showAlert({
                type: 'error',
                heading: 'Request Failed',
                message: applicationError.message || 'Failed to send reset link. Please try again.',
                icon: false,
                duration: 0
            })
        }
    }

    return (
        <FormCard
            title="Forgot Password"
            subtitle="Enter your email to reset password"
            footer={(
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Remember your password?{' '}
                    <Link to="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline">Login</Link>
                </p>
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
                        isLoading={forgotPasswordMutation.isPending}
                        loadingText="Sending..."
                        disabled={!email}
                    >
                        Send Reset Link
                    </Button>
                </div>
            </div>
        </FormCard>
    )
}
