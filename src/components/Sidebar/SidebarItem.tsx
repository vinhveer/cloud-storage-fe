import { Link } from '@tanstack/react-router'

export type SidebarItemProps = {
  title: string
  href?: string
  to?: string
  isActive?: boolean
  icon?: React.ReactNode
}

export default function SidebarItem({ title, href, to, isActive = false, icon }: SidebarItemProps) {
  const internalTo = to ?? href
  const isInternal = typeof internalTo === 'string' && internalTo.startsWith('/')
  const className =
    'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ' +
    (isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700')

  if (isInternal && internalTo) {
    return (
      <Link to={internalTo} className={className}>
        {icon ? <span className="mr-3 text-base text-gray-500">{icon}</span> : null}
        {title}
      </Link>
    )
  }

  return (
    <a href={href ?? '#'} className={className}>
      {icon ? <span className="mr-3 text-base text-gray-500">{icon}</span> : null}
      {title}
    </a>
  )
}


