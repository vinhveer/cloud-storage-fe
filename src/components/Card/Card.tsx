import clsx from 'clsx'
import type { CardProps } from '@/components/Card/types'

export const Card = ({
  title,
  subtitle,
  padding = 'lg',
  shadow = 'lg',
  border = true,
  className,
  children,
  ...rest
}: CardProps) => {
  const paddingClass =
    padding === 'none'
      ? 'p-0'
      : padding === 'sm'
      ? 'p-4'
      : padding === 'md'
      ? 'p-6'
      : padding === 'lg'
      ? 'p-8'
      : padding === 'xl'
      ? 'p-10'
      : 'p-8'

  const shadowClass =
    shadow === 'none'
      ? ''
      : shadow === 'sm'
      ? 'shadow-sm'
      : shadow === 'md'
      ? 'shadow-md'
      : shadow === 'lg'
      ? 'shadow-lg'
      : shadow === 'xl'
      ? 'shadow-xl'
      : shadow === '2xl'
      ? 'shadow-2xl'
      : 'shadow-lg'

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