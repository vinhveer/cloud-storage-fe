import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/Button/Button'
import { getProfile } from '@/api/features/auth/auth.api'
import { qk } from '@/api/query/keys'
import Loading from '@/components/Loading/Loading'
import UpdateProfileDialog from './components/UpdateProfileDialog'
import ChangePasswordDialog from './components/ChangePasswordDialog'

export default function AccountSettingsPage() {
  const [mounted, setMounted] = useState(false)
  const { data: user, isLoading } = useQuery({
    queryKey: qk.auth.profile(),
    queryFn: getProfile,
    enabled: mounted, // Only fetch on client side
  })

  const [updateProfileOpen, setUpdateProfileOpen] = useState(false)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)

  // Ensure CSR - only run on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center py-12">
        <Loading size="lg" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="top-0 z-10 bg-white dark:bg-[#0D1117] pt-1 pb-4">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Account settings</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update your profile information and security preferences.
          </p>
        </header>
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">Unable to load user profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="top-0 z-10 bg-white dark:bg-[#0D1117] pt-1 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Account settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Update your profile information and security preferences.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full name
            </label>
            <p className="text-sm text-gray-900 dark:text-white">{user.name || '-'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email address
            </label>
            <p className="text-sm text-gray-900 dark:text-white">{user.email || '-'}</p>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              onClick={() => setUpdateProfileOpen(true)}
            >
              Update Name
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Password</h2>

        <div className="pt-2">
          <Button
            variant="primary"
            onClick={() => setChangePasswordOpen(true)}
          >
            Change Password
          </Button>
        </div>
      </section>

      <UpdateProfileDialog
        title="Update Name"
        currentName={user.name}
        currentEmail={user.email}
        open={updateProfileOpen}
        onOpenChange={setUpdateProfileOpen}
        onSuccess={() => setUpdateProfileOpen(false)}
      />

      <ChangePasswordDialog
        title="Change Password"
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
        onSuccess={() => setChangePasswordOpen(false)}
      />
    </div>
  )
}

