import SidebarItem from './SidebarItem'
import { useSidebar } from '@/contexts/SidebarContext'

export default function Sidebar() {
  const { items, activeKey } = useSidebar()
  return (
    <aside className="w-64 h-full">
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


