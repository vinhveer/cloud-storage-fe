import clsx from 'clsx'
import React from 'react'

export type NavItem = {
  id: string
  label: string
  href?: string
  icon?: string
  badge?: string | number
}

export type NavGroupProps = React.HTMLAttributes<HTMLElement> & {
  items?: NavItem[]
  activeItem?: string | null
  orientation?: 'horizontal' | 'vertical'
}

export const NavGroup = ({
  items = [],
  activeItem = null,
  orientation = 'horizontal',
  className,
  ...rest
}: NavGroupProps) => {
  const orientationClasses =
    orientation === 'vertical' ? 'flex-col space-y-1' : 'flex-row space-x-1'

  return (
    <nav
      {...rest}
      className={clsx('not-prose flex', orientationClasses, 'p-1 bg-gray-100 rounded-lg', className)}
    >
      {items.map((item) => {
        const isActive = activeItem === item.id || activeItem === item.label

        return (
          <a
            key={item.id}
            href={item.href ?? '#'}
            className={clsx(
              'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
              isActive
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50',
            )}
          >
            {item.icon && <i className={clsx(item.icon, 'mr-2 text-xs')} aria-hidden />}
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                {item.badge}
              </span>
            )}
          </a>
        )
      })}
    </nav>
  )
}

export default NavGroup
