import { HomeIcon, FolderIcon, ShareIcon, TrashIcon, Squares2X2Icon, UsersIcon, EyeIcon, CircleStackIcon } from '@heroicons/react/24/outline'
import type { SidebarItemData } from '@/components/Sidebar/types'
import { sampleMenuItems } from '@/components/MDX/sample-data.mock'
import { isAdmin as readAdminFromGuard } from '@/utils/roleGuard'

function getBaseAppItems(): SidebarItemData[] {
  return [
    { key: 'home', title: 'Home', href: '/', icon: <HomeIcon className="w-5 h-5" /> },
    { key: 'files', title: 'My Files', href: '/my-files', icon: <FolderIcon className="w-5 h-5" /> },
    { key: 'shared', title: 'Shared', href: '/shared', icon: <ShareIcon className="w-5 h-5" /> },
    { key: 'trash', title: 'Trash', href: '/trash', icon: <TrashIcon className="w-5 h-5" /> },
  ]
}

function getAdminItems(isAdminUser: boolean): SidebarItemData[] {
  if (!isAdminUser) return []
  return [
    { key: 'admin-overview', title: 'Overview', href: '/admin', icon: <EyeIcon className="w-5 h-5" />, },
    { key: 'admin-user-management', title: 'User Management', href: '/admin/users', icon: <UsersIcon className="w-5 h-5" />, },
    { key: 'admin-storage-users', title: 'Storage Users', href: '/admin/storage', icon: <CircleStackIcon className="w-5 h-5" />, },
  ]
}

type SidebarConfig = {
  id: string
  match: (pathname: string) => boolean
  items: (ctx: { isAdmin: boolean }) => SidebarItemData[]
}

function prefixMatcher(prefixes: string[]): (pathname: string) => boolean {
  const norms = prefixes.map(normalizePath)
  return (pathname: string) => {
    const p = normalizePath(pathname)
    return norms.some((root) => p === root || (root === '/' ? p === '/' : p.startsWith(root + '/')))
  }
}

const SIDEBAR_CONFIGS: SidebarConfig[] = [
  {
    id: 'admin',
    match: prefixMatcher(['/admin']),
    items: ({ isAdmin }) => {
      const items = getBaseAppItems()
      if (isAdmin) {
        items.push(...getAdminItems(isAdmin))
      }
      return items
    },
  },
  {
    id: 'samples',
    match: prefixMatcher(['/samples']),
    items: ({ isAdmin }) => {
      // Filter admin items based on role
      const filtered = sampleMenuItems.filter(m => {
        if (m.requiresAdmin) {
          return isAdmin
        }
        return true
      })
      return filtered.map((m) => ({
        key: m.href,
        title: m.title,
        href: m.href,
        icon: <Squares2X2Icon className="w-5 h-5" />,
      }))
    },
  },
  {
    id: 'app',
    match: prefixMatcher(['', '/', '/app', '/my-files', '/shared', '/trash']),
    items: ({ isAdmin }) => {
      const baseItems = getBaseAppItems()
      if (isAdmin) {
        baseItems.push(...getAdminItems(isAdmin))
      }
      return baseItems
    },
  },
]

export function getItemsForPath(pathname: string, options?: { isAdmin?: boolean }): SidebarItemData[] {
  const config = SIDEBAR_CONFIGS.find((c) => c.match(pathname))
  const isAdmin = options?.isAdmin ?? (typeof window !== 'undefined' && readAdminFromGuard())
  return config ? config.items({ isAdmin }) : []
}

export function pickActiveKey(items: SidebarItemData[], pathname: string): string | undefined {
  const norm = normalizePath(pathname)
  const match = items.find((it) => normalizePath(it.href ?? '') === norm)
  return match?.key
}

function normalizePath(pathname?: string): string {
  const p = pathname && pathname.length > 0 ? pathname : '/'
  if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1)
  return p
}


