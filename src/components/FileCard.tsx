import React from 'react'
import clsx from 'clsx'

export type FileCardProps = React.HTMLAttributes<HTMLDivElement> & {
  iconClass?: string
  title: string
  subtitle?: string
  detailsHref?: string
  width?: number
}

export const FileCard = ({
  iconClass = 'fas fa-file',
  title,
  subtitle,
  detailsHref = '#',
  width = 100,
  className,
  style,
  ...rest
}: FileCardProps) => {
  const computedStyle: React.CSSProperties = { width: `${width}%`, ...style }

  return (
    <div
      {...rest}
      style={computedStyle}
      className={clsx(
        'not-prose bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 hover:border-gray-300',
        className
      )}
    >
      <div className="mb-4">
        <i className={clsx(iconClass, 'text-blue-600 text-6xl')} />
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div>
        <a
          href={detailsHref}
          className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
        >
          Details
        </a>
      </div>
    </div>
  )
}

export default FileCard
