import clsx from 'clsx'
import type { CardProps } from '@/components/Card/types'

const paddingClassMap: Record<NonNullable<CardProps['padding']>, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
}

const shadowClassMap: Record<NonNullable<CardProps['shadow']>, string> = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
}

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