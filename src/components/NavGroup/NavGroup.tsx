import clsx from 'clsx'
import React from 'react'
import type { NavGroupProps } from '@/components/NavGroup/types'

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
      className={clsx(
        'not-prose flex',
        orientationClasses,
        'p-1 bg-gray-100 rounded-lg',
        // Dark mode: match Card background
        'dark:bg-gray-800 dark:text-gray-200',
        className,
      )}
    >
      {items.map((item) => {
        const isActive = activeItem === item.id || activeItem === item.label

        return (
          <a
            key={item.id}
            href={item.href ?? '#'}
            className={clsx(
              'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
              // Base text color in dark mode
              'dark:text-gray-200',
              isActive
                ? // Active styles
                  'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                : // Inactive + hover styles
                  'text-gray-600 hover:text-gray-900 hover:bg-white/50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700/40',
            )}
          >
            {item.icon && <i className={clsx(item.icon, 'mr-2 text-base')} aria-hidden />}
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 rounded-full dark:bg-white/20 dark:text-white">
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
