import { Subnav, type SubnavItem } from '@/components/Subnav'

export function SubnavBasicDemo() {
  const items: SubnavItem[] = [
    { id: 'home', label: 'Home', href: '#' },
    { id: 'files', label: 'Files', href: '#' },
    { id: 'settings', label: 'Settings', href: '#' },
  ]
  return (
    <div className="mt-4">
      <Subnav items={items} activeItem="files" />
    </div>
  )
}

export function SubnavVerticalDemo() {
  const items: SubnavItem[] = [
    { id: 'overview', label: 'Overview', href: '#' },
    { id: 'usage', label: 'Usage', href: '#' },
    { id: 'billing', label: 'Billing', href: '#' },
  ]
  return (
    <div className="mt-4">
      <Subnav items={items} activeItem="overview" orientation="vertical" />
    </div>
  )
}

export function SubnavWithBadgesDemo() {
  const items: SubnavItem[] = [
    { id: 'inbox', label: 'Inbox', href: '#', badge: 5, icon: 'far fa-inbox' },
    { id: 'shared', label: 'Shared', href: '#', badge: 2, icon: 'far fa-users' },
    { id: 'archive', label: 'Archive', href: '#', icon: 'far fa-archive' },
  ]
  return (
    <div className="mt-4">
      <Subnav items={items} activeItem="shared" />
    </div>
  )
}
