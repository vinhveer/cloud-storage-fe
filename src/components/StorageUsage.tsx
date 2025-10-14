import React from 'react'
import clsx from 'clsx'

export type StorageUsageProps = React.HTMLAttributes<HTMLDivElement> & {
  used: number
  total: number
  precision?: number
  colorClassName?: string
}

export default function StorageUsage({
  used,
  total,
  precision = 2,
  colorClassName = 'bg-blue-600',
  className,
  ...rest
}: StorageUsageProps) {
  const safeTotal = total <= 0 ? 1 : total
  const rawPercent = (used / safeTotal) * 100
  const percentage = Math.max(0, Math.min(100, Math.round(rawPercent)))

  const usedFormatted = Number.isFinite(used) ? used.toFixed(precision) : '0'
  const totalFormatted = Number.isFinite(total) ? total.toFixed(precision) : '0'

  const widthStyle: React.CSSProperties = { width: `${percentage}%` }

  return (
    <div {...rest} className={clsx('not-prose space-y-2', className)}>
      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {percentage}% - Use {usedFormatted}GB of {totalFormatted}GB
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden" aria-label="storage-usage">
        <div
          className={clsx(colorClassName, 'h-full rounded-full transition-all duration-300')}
          style={widthStyle}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}


