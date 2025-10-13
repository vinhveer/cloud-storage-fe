import clsx from 'clsx'

type SidebarLinkProps = {
  title: string
  href?: string
  isActive?: boolean
  icon?: string
}

export default function SidebarLink({
  title,
  href = '#',
  isActive = false,
  icon,
}: SidebarLinkProps) {
  return (
    <a
      href={href}
      className={clsx(
        'not-prose flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700',
      )}
    >
      {icon && <i className={clsx(icon, 'mr-4 text-base')} aria-hidden />}
      {title}
    </a>
  )
}

export type { SidebarLinkProps }
