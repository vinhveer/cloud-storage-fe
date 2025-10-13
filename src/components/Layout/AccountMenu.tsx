import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type AccountMenuProps = {
  userName?: string
  userEmail?: string
  userAvatar?: string | null
  settingsHref?: string
  onLogout?: () => Promise<void> | void
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2)
}

export default function AccountMenu({
  userName = 'User',
  userEmail = 'user@example.com',
  userAvatar = null,
  settingsHref = '#',
  onLogout,
}: AccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const initials = useMemo(() => getInitials(userName), [userName])

  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current) return
      if (containerRef.current.contains(event.target as Node)) return
      close()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [close])

  const handleLogout = useCallback(async () => {
    if (!onLogout) return
    await onLogout()
    close()
  }, [close, onLogout])

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={toggle}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {userAvatar ? (
          <img
            src={userAvatar}
            alt={userName}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 min-w-72 rounded-lg border border-gray-200 bg-white pt-3 shadow-lg">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{userName}</p>
                <p className="truncate text-xs text-gray-500">{userEmail}</p>
              </div>
            </div>
          </div>

          <div className="py-1">
            <a
              href={settingsHref}
              className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <i className="fas fa-cog mr-3 text-gray-400" aria-hidden />
              Account Settings
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <i className="fas fa-sign-out-alt mr-3" aria-hidden />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export type { AccountMenuProps }
