import clsx from 'clsx'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import type { BreadcrumbProps } from '@/components/Breadcrumb/types'
import { useBreadcrumb } from '@/components/Breadcrumb/useBreadcrumb'

export default function Breadcrumb({ items, className, separatorIconClassName, onItemClick }: BreadcrumbProps) {
  const { segments, hasItems } = useBreadcrumb({ items })

  if (!hasItems) return null

  return (
    <nav
      className={clsx('not-prose flex items-center text-sm text-gray-500 dark:text-gray-400', className)}
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center space-x-1">
        {segments.map((segment) => (
          <li key={segment.id ?? segment.index} className="inline-flex items-center">
            {segment.index > 0 && (
              <ChevronRightIcon
                className={clsx(
                  'mx-1 h-3.5 w-3.5 text-gray-400 dark:text-gray-500',
                  separatorIconClassName
                )}
                aria-hidden="true"
              />
            )}
             {!segment.isCurrent && (segment.href || onItemClick) ? (
              segment.href ? (
                <a
                  href={segment.href}
                  className="inline-flex items-center rounded-md px-2 py-1 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={(event) => {
                    onItemClick?.(segment, segment.index)
                    // allow normal navigation
                    return event
                  }}
                >
                  {segment.iconLeft && (
                    <span className="mr-1 inline-flex h-4 w-4 items-center justify-center text-gray-400 dark:text-gray-500">
                      {segment.iconLeft}
                    </span>
                  )}
                  <span className="truncate max-w-[10rem]">{segment.label}</span>
                </a>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center rounded-md px-2 py-1 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => onItemClick?.(segment, segment.index)}
                >
                  {segment.iconLeft && (
                    <span className="mr-1 inline-flex h-4 w-4 items-center justify-center text-gray-400 dark:text-gray-500">
                      {segment.iconLeft}
                    </span>
                  )}
                  <span className="truncate max-w-[10rem]">{segment.label}</span>
                </button>
              )
            ) : (
              <span
                aria-current={segment.isCurrent ? 'page' : undefined}
                className={clsx(
                  'inline-flex items-center rounded-md px-2 py-1',
                  segment.isCurrent
                    ? 'font-medium text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800'
                    : 'text-gray-500 dark:text-gray-400'
                )}
              >
                {segment.iconLeft && (
                  <span className="mr-1 inline-flex h-4 w-4 items-center justify-center text-gray-400 dark:text-gray-500">
                    {segment.iconLeft}
                  </span>
                )}
                <span className="truncate max-w-[10rem]">{segment.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}


