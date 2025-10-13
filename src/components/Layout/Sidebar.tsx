import SidebarLink from '@/components/Layout/SidebarLink'
import StorageUsageCard from '@/components/Layout/StorageUsageCard'

type SidebarProps = {
  activeItem?: 'home' | 'files' | 'shared' | 'trash'
}

export function Sidebar({ activeItem = 'home' }: SidebarProps) {
  return (
    <aside className="not-prose w-64 shrink-0 bg-white border-r border-gray-100">
      <div className="p-4 pt-6">
        <nav className="space-y-1">
          <SidebarLink
            title="Home"
            href="/"
            isActive={activeItem === 'home'}
            icon="fas fa-home"
          />

          <SidebarLink
            title="My Files"
            href="/files"
            isActive={activeItem === 'files'}
            icon="fas fa-folder"
          />

          <SidebarLink
            title="Your Shared"
            href="/shared"
            isActive={activeItem === 'shared'}
            icon="fas fa-share-alt"
          />

          <SidebarLink
            title="Trash"
            href="/trash"
            isActive={activeItem === 'trash'}
            icon="fas fa-trash"
          />
        </nav>

        <StorageUsageCard used={14.8} total={20} className="mt-6" />
      </div>
    </aside>
  )
}

export default Sidebar
