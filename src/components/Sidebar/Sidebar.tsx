import SidebarItem from './SidebarItem'
import { useSidebar } from '@/components/Sidebar/SidebarContext'
import type { SidebarProps } from '@/components/Sidebar/types'

export default function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const { items, activeKey } = useSidebar()
  if (!items || items.length === 0) return null

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


