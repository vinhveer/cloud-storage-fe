import { NavGroup, type NavItem } from '@/components/NavGroup'

export function NavGroupBasicDemo() {
  const items: NavItem[] = [
    { id: 'home', label: 'Home', href: '#' },
    { id: 'files', label: 'Files', href: '#' },
    { id: 'settings', label: 'Settings', href: '#' },
  ]
  return (
    <div className="mt-4">
      <NavGroup items={items} activeItem="files" />
    </div>
  )
}

export function NavGroupVerticalDemo() {
  const items: NavItem[] = [
    { id: 'overview', label: 'Overview', href: '#' },
    { id: 'usage', label: 'Usage', href: '#' },
    { id: 'billing', label: 'Billing', href: '#' },
  ]
  return (
    <div className="mt-4">
      <NavGroup items={items} activeItem="overview" orientation="vertical" />
    </div>
  )
}

export function NavGroupWithBadgesDemo() {
  const items: NavItem[] = [
    { id: 'inbox', label: 'Inbox', href: '#', badge: 5, icon: 'fas fa-inbox' },
    { id: 'shared', label: 'Shared', href: '#', badge: 2, icon: 'fas fa-share-alt' },
    { id: 'archive', label: 'Archive', href: '#', icon: 'fas fa-archive' },
  ]
  return (
    <div className="mt-4">
      <NavGroup items={items} activeItem="shared" />
    </div>
  )
}
