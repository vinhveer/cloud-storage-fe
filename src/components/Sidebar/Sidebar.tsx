import SidebarItem from './SidebarItem'
import { useSidebar } from '@/components/Sidebar/SidebarContext'
import type { SidebarProps } from '@/components/Sidebar/types'
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

  const renderNav = (onItemClick?: () => void) => (
    <div className="p-2 pt-6">
      <nav className="space-y-1">
        {items.map((it) => (
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
      {!isLoadingStorage && storageLimit && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 px-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
            Storage Usage
          </h3>
          <StorageUsage used={storageUsedGB} total={storageLimitGB} />
        </div>
      )}
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


