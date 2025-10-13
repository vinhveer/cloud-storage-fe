import clsx from 'clsx'

type StorageUsageCardProps = {
  used?: number | string
  total?: number | string
  className?: string
}

function normalizeNumber(value: number | string | undefined) {
  if (value === undefined) return 0
  if (typeof value === 'number') return value
  const parsed = parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function resolveWidthClass(percentage: number) {
  if (percentage <= 10) return 'w-[10%]'
  if (percentage <= 20) return 'w-[20%]'
  if (percentage <= 30) return 'w-[30%]'
  if (percentage <= 40) return 'w-[40%]'
  if (percentage <= 50) return 'w-[50%]'
  if (percentage <= 60) return 'w-[60%]'
  if (percentage <= 70) return 'w-[70%]'
  if (percentage <= 80) return 'w-[80%]'
  if (percentage <= 90) return 'w-[90%]'
  return 'w-full'
}

export default function StorageUsageCard({
  used = 0,
  total = 0,
  className,
}: StorageUsageCardProps) {
  const usedValue = normalizeNumber(used)
  const totalValue = Math.max(normalizeNumber(total), 0.0001)
  const percentage = Math.round((usedValue / totalValue) * 100)
  const displayPercentage = Math.min(Math.max(percentage, 0), 100)
  const widthClass = resolveWidthClass(displayPercentage)

  return (
    <div className={clsx('not-prose mt-8 rounded-lg bg-gray-50 p-3', className)}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">Storage</span>
        <span className="text-xs text-gray-500">
          {usedValue} GB of {totalValue} GB
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-200">
        <div className={clsx('h-1.5 rounded-full bg-blue-600', widthClass)} />
      </div>
    </div>
  )
}

export type { StorageUsageCardProps }
