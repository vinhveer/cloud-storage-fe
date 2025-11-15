import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import type { BreadcrumbItem } from '@/components/Breadcrumb/types'

export function BasicBreadcrumbDemo() {
  const items: BreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'files', label: 'My files', href: '/app/my-files' },
    { id: 'current', label: 'Current folder' },
  ]

  return (
    <div className="p-4">
      <Breadcrumb items={items} />
    </div>
  )
}


