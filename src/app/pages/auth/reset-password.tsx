import React from 'react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import FormCard from '@/components/FormCard/FormCard'
import FormGroup from '@/components/FormGroup/FormGroup'
import FormInput from '@/components/FormGroup/FormInput/FormInput'
import { Button } from '@/components/Button/Button'
import { useResetPassword } from '@/api/features/auth/auth.mutations'
import { AppError } from '@/api/core/error'
import { useAlert } from '@/components/Alert'

export default function ResetPasswordPage() {
    const search = useSearch({ strict: false }) as { token?: string; email?: string }
    const token = search.token || ''
    const emailParam = search.email || ''

    const [password, setPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const resetPasswordMutation = useResetPassword()
    const { showAlert } = useAlert()
    const navigate = useNavigate()

    function passwordsMatch() {
        return password === confirmPassword
    }

    async function handleResetPassword() {
        if (resetPasswordMutation.isPending) {
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

        if (!token || !emailParam) {
            showAlert({
                type: 'error',
                message: 'Invalid reset link. Please request a new one.',
                duration: 5000
            })
            return
        }

        try {
            const response = await resetPasswordMutation.mutateAsync({
                token,
                email: emailParam,
                password,
                passwordConfirmation: confirmPassword,
            })

            showAlert({
                type: 'success',
                heading: 'Password Reset Successful',
                message: response.message || 'Your password has been reset. Please login with your new password.',
                duration: 5000
            })

            // Redirect to login page after short delay
            setTimeout(() => {
                navigate({ to: '/auth/login' })
            }, 1000)
        } catch (unknownError) {
            const applicationError = unknownError as AppError
            showAlert({
                type: 'error',
                heading: 'Reset Failed',
                message: applicationError.message || 'Failed to reset password. Please try again or request a new link.',
                icon: false,
                duration: 0
            })
        }
    }

    return (
        <FormCard
            title="Reset Password"
            subtitle="Enter your new password"
            footer={(
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Remember your password?{' '}
                    <Link to="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline">Login</Link>
                </p>
            )}
        >
            <div className="space-y-4">
                {/* Hidden email field or just display it if needed, but usually hidden or readonly */}
                <input type="hidden" value={emailParam} />
                <input type="hidden" value={token} />

                <FormGroup label="New Password">
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
                        onClick={handleResetPassword}
                        variant="primary"
                        size="lg"
                        isLoading={resetPasswordMutation.isPending}
                        loadingText="Resetting..."
                        disabled={!password || !confirmPassword || !token || !emailParam}
                    >
                        Reset Password
                    </Button>
                </div>
            </div>
        </FormCard>
    )
}
