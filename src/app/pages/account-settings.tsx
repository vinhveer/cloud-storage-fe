import type React from 'react'
import FormGroup from '@/components/FormGroup/FormGroup'
import FormInput from '@/components/FormGroup/FormInput/FormInput'
import { Button } from '@/components/Button/Button'

export default function AccountSettingsPage() {
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    // TODO: wire to API when backend is ready
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Account settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Update your profile information and security preferences.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>

        <FormGroup label="Full name">
          <FormInput name="name" placeholder="Your full name" />
        </FormGroup>

        <FormGroup label="Email address" help="Used for login and important notifications.">
          <FormInput name="email" type="email" placeholder="you@example.com" />
        </FormGroup>
      </section>

      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Password</h2>

        <FormGroup label="Current password">
          <FormInput name="currentPassword" type="password" autoComplete="current-password" />
        </FormGroup>

        <FormGroup label="New password">
          <FormInput name="newPassword" type="password" autoComplete="new-password" />
        </FormGroup>

        <FormGroup label="Confirm new password">
          <FormInput name="confirmPassword" type="password" autoComplete="new-password" />
        </FormGroup>
      </section>

      <div className="flex justify-start gap-3 pt-2">
        <Button type="submit" variant="primary">
          Save changes
        </Button>
        <Button type="button" variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  )
}


