import React from 'react'
import clsx from 'clsx'
import type { FileCardProps } from '@/components/FileCard/types'
import { iconMap } from '@/components/FileCard/constants'
import { Button } from '@/components/Button/Button'

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
        'filecard-root',
        className
      )}
    >
      <div className="filecard-icon">
        <IconComponent className={clsx(iconColor, 'filecard-icon-svg')} />
      </div>
      <div className="filecard-text">
        <h3 className="filecard-title">{title}</h3>
        {subtitle && <p className="filecard-subtitle">{subtitle}</p>}
      </div>
      <div>
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            try {
              globalThis.location.href = detailsHref
            } catch {
              // ignore navigation errors
            }
          }}
          aria-label="View details"
          className="filecard-cta"
        >
          Details
        </Button>
      </div>
    </div>
  )
}

export default FileCard
