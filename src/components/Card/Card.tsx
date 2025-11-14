import clsx from 'clsx'
import type { CardProps } from '@/components/Card/types'
import { paddingClassMap, shadowClassMap } from '@/components/Card/constants'

export const Card = ({
  title,
  subtitle,
  padding = 'lg',
  shadow = 'lg',
  border = true,
  className,
  children,
  ...rest
}: Readonly<CardProps>) => {
  const paddingClass = paddingClassMap[padding] ?? 'p-8'
  const shadowClass = shadowClassMap[shadow] ?? 'shadow-lg'

  const borderClass = border ? 'card-border' : ''

  return (
    <div
      {...rest}
      className={clsx('card-root', paddingClass, shadowClass, borderClass, className)}
    >
      {(title || subtitle) && (
        <div className={clsx(padding === 'none' ? 'mb-0' : 'mb-6')}>
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
          )}
          {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>}
        </div>
      )}

      <div className="space-y-6">{children}</div>
    </div>
  )
}

export default Card