import { useState } from 'react'
import clsx from 'clsx'
import { Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid'
import Dialog from '@/components/Dialog/Dialog'
import { useAccountDropdown } from '@/hooks/components/Navbar/AccountDropdown/useAccountDropdown'

export type AccountDropdownProps = {
  userName?: string
  userEmail?: string
  userAvatar?: string | null
  settingsHref?: string
  onLogout?: () => Promise<void> | void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function getInitialsFromName(name: string): string {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2)
  return initials || 'U'
}

export function AccountDropdown({
  userName = 'User',
  userEmail = 'user@example.com',
  userAvatar = null,
  settingsHref = '#',
  onLogout,
  open,
  defaultOpen = false,
  onOpenChange,
}: AccountDropdownProps) {
  const { isOpen, setOpen, toggle, containerRef, initials } = useAccountDropdown({ userName, open, defaultOpen, onOpenChange })
  const [logoutOpen, setLogoutOpen] = useState(false)

  const onConfirmLogout = async () => {
    await onLogout?.()
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={toggle}
        className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {userAvatar ? (
          <img src={userAvatar} alt={userName} className="h-full w-full rounded-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </button>

      {isOpen && (
        <div
          className={clsx(
            'absolute right-0 mt-2 min-w-72 bg-white rounded-lg shadow-lg border border-gray-200 pt-3 z-50'
          )}
          role="menu"
          aria-label="Account menu"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>
            </div>
          </div>

          <div className="py-1">
            <a
              href={settingsHref}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              role="menuitem"
            >
              <Cog6ToothIcon className="mr-3 w-4 h-4 text-gray-400" aria-hidden="true" />
              Account Settings
            </a>

            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              role="menuitem"
            >
              <ArrowRightOnRectangleIcon className="mr-3 w-4 h-4" aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
      )}

      {logoutOpen && (
        <Dialog
          title="Logout"
          confirmText="Are you sure you want to logout?"
          confirmButtonText="Logout"
          cancelButtonText="Cancel"
          confirmType="danger"
          open={logoutOpen}
          onOpenChange={setLogoutOpen}
          onConfirm={onConfirmLogout}
          onCancel={() => setLogoutOpen(false)}
        />
      )}
    </div>
  )
}

export default AccountDropdown


