import React from 'react'
import clsx from 'clsx'
import Card from '@/components/Card'

export type FormCardProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string
  subtitle?: string
  action?: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  csrfToken?: string
  formProps?: React.FormHTMLAttributes<HTMLFormElement>
  footer?: React.ReactNode
  cardClassName?: string
}

export default function FormCard({
  title,
  subtitle,
  action,
  method = 'POST',
  csrfToken,
  formProps,
  footer,
  className,
  cardClassName,
  children,
  ...rest
}: FormCardProps) {
  const normalizedMethod = method ?? 'POST'
  const htmlFormMethod = normalizedMethod === 'GET' || normalizedMethod === 'POST' ? normalizedMethod : 'POST'
  const shouldAddMethodOverride = normalizedMethod !== 'GET' && normalizedMethod !== 'POST'
  const shouldAddCsrf = normalizedMethod !== 'GET' && typeof csrfToken === 'string' && csrfToken.length > 0

  return (
    <div
      {...rest}
      className={clsx(
        'not-prose min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      <div className="max-w-md w-full space-y-8">
        <Card title={title} subtitle={subtitle} className={clsx('w-full', cardClassName)}>
          {action ? (
            <form action={action} method={htmlFormMethod} className="space-y-6" {...formProps}>
              {shouldAddMethodOverride && (
                <input type="hidden" name="_method" value={normalizedMethod} />
              )}
              {shouldAddCsrf && <input type="hidden" name="_token" value={csrfToken} />}
              {children}
            </form>
          ) : (
            <div className="space-y-6">{children}</div>
          )}
        </Card>

        {footer && <div className="text-center">{footer}</div>}
      </div>
    </div>
  )}


