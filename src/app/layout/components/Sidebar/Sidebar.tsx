import SidebarItem from './SidebarItem'
import { useSidebar } from './SidebarContext'
import type { SidebarProps } from './types'
import StorageUsage from '@/components/StorageUsage/StorageUsage'
import { useStorageLimit } from '@/api/features/storage/storage.queries'

function bytesToGB(bytes: number): number {
  return bytes / (1024 * 1024 * 1024)
}

export default function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const { items, activeKey } = useSidebar()
  const { data: storageLimit, isLoading: isLoadingStorage } = useStorageLimit()

  const storageUsedGB = storageLimit ? bytesToGB(storageLimit.storage_used) : 0
  const storageLimitGB = storageLimit ? bytesToGB(storageLimit.storage_limit) : 0

  // Separate base items and admin items
  const baseItems = items.filter((it) => !it.key.startsWith('admin-'))
  const adminItems = items.filter((it) => it.key.startsWith('admin-'))
  const hasAdminItems = adminItems.length > 0

  const renderNav = (onItemClick?: () => void) => (
    <div className="p-2 pt-6">
      <nav className="space-y-1">
        {/* Base items */}
        {baseItems.map((it) => (
          <SidebarItem
            key={it.key}
            title={it.title}
            to={it.href}
            href={it.href}
            isActive={activeKey === it.key}
            icon={it.icon}
            onClick={onItemClick}
          />
        ))}

        {/* Storage Usage */}
        {!isLoadingStorage && storageLimit && (
          <div className="px-4 py-5">
            <StorageUsage used={storageUsedGB} total={storageLimitGB} />
          </div>
        )}

        {/* Admin section title */}
        {hasAdminItems && (
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Admin
            </h3>
          </div>
        )}

        {/* Admin items */}
        {adminItems.map((it) => (
          <SidebarItem
            key={it.key}
            title={it.title}
            to={it.href}
            href={it.href}
            isActive={activeKey === it.key}
            icon={it.icon}
            onClick={onItemClick}
          />
        ))}
      </nav>

      
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 fixed left-0 top-[calc(var(--navbar-h)+2px)] h-[calc(100dvh-var(--navbar-h)-2px)] overflow-y-auto sidebar-scrollbar bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40">
        {renderNav()}
      </aside>

      {/* Mobile / tablet drawer */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[calc(var(--navbar-h)+2px)] bottom-0 z-40 flex lg:hidden">
          <aside className="w-64 h-full overflow-y-auto sidebar-scrollbar bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
            {renderNav(onMobileClose)}
          </aside>
          <button
            type="button"
            aria-label="Close sidebar"
            className="flex-1 bg-black/40 dark:bg-black/60"
            onClick={onMobileClose}
          />
        </div>
      )}
    </>
  )
}


