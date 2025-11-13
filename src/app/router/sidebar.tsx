import { HomeIcon, FolderIcon, ShareIcon, TrashIcon, Squares2X2Icon } from '@heroicons/react/24/outline'
import type { SidebarItemData } from '@/components/Sidebar/SidebarContext'
import { sampleMenuItems } from '@/components/MDX/sample-data.mock'

type SidebarConfig = {
  id: string
  match: (pathname: string) => boolean
  items: () => SidebarItemData[]
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
    id: 'samples',
    match: prefixMatcher(['/samples']),
    items: () => sampleMenuItems.map((m) => ({
      key: m.href,
      title: m.title,
      href: m.href,
      icon: <Squares2X2Icon className="w-5 h-5" />,
    })),
  },
  {
    id: 'app',
    match: prefixMatcher(['', '/', '/app', '/my-files', '/shared', '/trash']),
    items: () => [
      { key: 'home', title: 'Home', href: '/', icon: <HomeIcon className="w-5 h-5" /> },
      { key: 'files', title: 'My Files', href: '/my-files', icon: <FolderIcon className="w-5 h-5" /> },
      { key: 'shared', title: 'Shared', href: '/shared', icon: <ShareIcon className="w-5 h-5" /> },
      { key: 'trash', title: 'Trash', href: '/trash', icon: <TrashIcon className="w-5 h-5" /> },
    ],
  },
]

export function getItemsForPath(pathname: string): SidebarItemData[] {
  const config = SIDEBAR_CONFIGS.find((c) => c.match(pathname))
  return config ? config.items() : []
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


