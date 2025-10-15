import { Subnav, type SubnavItem } from '@/components/Subnav/Subnav'

export function SubnavBasicDemo() {
  const items: SubnavItem[] = [
    { id: 'home', label: 'Home', href: '#', icon: 'fas fa-home' },
    { id: 'files', label: 'Files', href: '#', icon: 'far fa-folder' },
    { id: 'settings', label: 'Settings', href: '#', icon: 'fas fa-cog' },
  ]
  return (
    <div className="mt-4">
      <Subnav items={items} activeItem="files" />
    </div>
  )
}

export function SubnavVerticalDemo() {
  const items: SubnavItem[] = [
    { id: 'overview', label: 'Overview', href: '#', icon: 'far fa-clipboard' },
    { id: 'usage', label: 'Usage', href: '#', icon: 'far fa-chart-bar' },
    { id: 'billing', label: 'Billing', href: '#', icon: 'far fa-credit-card' },
  ]
  return (
    <div className="mt-4">
      <Subnav items={items} activeItem="overview" orientation="vertical" />
    </div>
  )
}

export function SubnavWithBadgesDemo() {
  const items: SubnavItem[] = [
    { id: 'inbox', label: 'Inbox', href: '#', badge: 5, icon: 'fas fa-inbox' },
    { id: 'shared', label: 'Shared', href: '#', badge: 2, icon: 'fas fa-share-alt' },
    { id: 'archive', label: 'Archive', href: '#', icon: 'fas fa-archive' },
  ]
  return (
    <div className="mt-4">
      <Subnav items={items} activeItem="shared" />
    </div>
  )
}
