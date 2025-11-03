import SidebarItem from './SidebarItem'
import { useSidebar } from '@/contexts/SidebarContext'

export default function Sidebar() {
  const { items, activeKey } = useSidebar()
  if (!items || items.length === 0) return null
  return (
    <aside className="w-64 fixed left-0 top-[calc(var(--navbar-h)+2px)] h-[calc(100dvh-var(--navbar-h)-2px)] overflow-y-auto sidebar-scrollbar bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40">
      <div className="p-2 pt-6">
        <nav className="space-y-1">
          {items.map((it) => (
            <SidebarItem key={it.key} title={it.title} to={it.href} href={it.href} isActive={activeKey === it.key} icon={it.icon} />
          ))}
        </nav>
      </div>
    </aside>
  )
}


