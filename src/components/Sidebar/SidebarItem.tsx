import React from 'react'
import { Link } from '@tanstack/react-router'
import { Squares2X2Icon } from '@heroicons/react/24/outline'

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
    (isActive
      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
      : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300')

  // Normalize icon: always render inside a fixed 20px box; ensure SVG has w-5 h-5
  const baseIcon = icon ?? <Squares2X2Icon className="w-5 h-5" />
  const merge = (...cs: (string | undefined)[]) => cs.filter(Boolean).join(' ')
  const renderedIcon = React.isValidElement(baseIcon)
    ? React.cloneElement(baseIcon as React.ReactElement, {
        className: merge('w-5 h-5', (baseIcon as React.ReactElement<{ className?: string }>).props?.className),
        'aria-hidden': true,
        focusable: false,
      })
    : baseIcon

  if (isInternal && internalTo) {
    return (
      <Link to={internalTo} className={className}>
        <span className="mr-3 shrink-0 grid place-items-center w-5 h-5 text-gray-500 dark:text-gray-400">{renderedIcon}</span>
        {title}
      </Link>
    )
  }

  return (
    <a href={href ?? '#'} className={className}>
      <span className="mr-3 shrink-0 grid place-items-center w-5 h-5 text-gray-500 dark:text-gray-400">{renderedIcon}</span>
      {title}
    </a>
  )
}


