import React from 'react'
import clsx from 'clsx'
import { DocumentIcon, DocumentTextIcon, PhotoIcon, FolderIcon, TableCellsIcon } from '@heroicons/react/24/solid'
import type { IconName, FileCardProps } from '@/components/FileCard/types'
import { Button } from '@/components/Button/Button'

const iconMap: Record<IconName, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  'file': DocumentIcon,
  'file-alt': DocumentTextIcon,
  'file-csv': TableCellsIcon,
  'file-image': PhotoIcon,
  'file-word': DocumentTextIcon,
  'file-excel': TableCellsIcon,
  'file-pdf': DocumentIcon,
  'file-lines': DocumentTextIcon,
  'folder': FolderIcon,
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
          onClick={() => { try { globalThis.location.href = detailsHref } catch {} }}
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
