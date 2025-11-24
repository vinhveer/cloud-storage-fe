import React from 'react'
import { useRouterState } from '@tanstack/react-router'
import { useSidebar } from '@/components/Sidebar/SidebarContext'
import { getItemsForPath, pickActiveKey } from '../sidebar'
import { isAdmin } from '@/utils/roleGuard'
import { useRoleVersion } from '@/hooks/useRoleVersion'

function areSame(
  a: { key: string; title: string; href?: string }[],
  b: { key: string; title: string; href?: string }[]
) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    const ai = a[i]; const bi = b[i]
    if (ai.key !== bi.key || ai.title !== bi.title || ai.href !== bi.href) return false
  }
  return true
}

export default function SidebarSync() {
  const { location } = useRouterState({ select: (s) => ({ location: s.location }) })
  const pathname = location.pathname
  const { items, setItems, setActiveKey } = useSidebar()
  const roleVersion = useRoleVersion()
  const isAdminSnapshot = React.useMemo(() => (typeof window !== 'undefined' ? isAdmin() : false), [roleVersion])

  React.useEffect(() => {
    const expectedItems = getItemsForPath(pathname, { isAdmin: isAdminSnapshot })
    const current = items.map((it: any) => ({ key: it.key, title: it.title, href: it.href }))
    const expected = expectedItems.map((it: any) => ({ key: it.key, title: it.title, href: it.href }))
    if (!areSame(current, expected)) {
      setItems(expectedItems)
    }
    setActiveKey(pickActiveKey(expectedItems, pathname))
  }, [pathname, items, setItems, setActiveKey, roleVersion, isAdminSnapshot])

  return null
}


