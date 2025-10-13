import React from 'react'
import clsx from 'clsx'
import { iconMap, IconName } from '@/lib/icons'

export type FileCardProps = React.HTMLAttributes<HTMLDivElement> & {
  icon?: IconName
  iconColor?: string
  title: string
  subtitle?: string
  detailsHref?: string
  width?: number
}

export const FileCard = ({
  icon = 'file',
  iconColor = 'text-blue-600',
  title,
  subtitle,
  detailsHref = '#',
  width = 100,
  className,
  style,
  ...rest
}: FileCardProps) => {
  const computedStyle: React.CSSProperties = { width: `${width}%`, ...style }
  const IconComponent = iconMap[icon]

  return (
    <div
      {...rest}
      style={computedStyle}
      className={clsx(
        'not-prose bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600',
        className
      )}
    >
      <div className="mb-4">
        <IconComponent size={64} className={clsx(iconColor)} />
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div>
        <a
          href={detailsHref}
          className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-sm"
        >
          Details
        </a>
      </div>
    </div>
  )
}

export default FileCard
