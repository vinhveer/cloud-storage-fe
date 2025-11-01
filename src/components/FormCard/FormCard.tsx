import React from 'react'
import clsx from 'clsx'
import Card from '@/components/Card/Card'
import { Button } from '@/components/Button/Button'

export type FormCardProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string
  subtitle?: string
  action?: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  csrfToken?: string
  formProps?: React.FormHTMLAttributes<HTMLFormElement>
  footer?: React.ReactNode
  cardClassName?: string
  submitText?: string
  onSubmitClick?: () => void
  submitVariant?: 'primary' | 'secondary' | 'danger'
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
  submitText,
  onSubmitClick,
  submitVariant = 'primary',
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
        'not-prose min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8',
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
              {submitText && (
                <div className="pt-2">
                  <Button type="submit" variant={submitVariant}>{submitText}</Button>
                </div>
              )}
            </form>
          ) : (
            <div className="space-y-6">
              {children}
              {submitText && (
                <div className="pt-2">
                  <Button onClick={onSubmitClick} variant={submitVariant}>{submitText}</Button>
                </div>
              )}
            </div>
          )}
        </Card>

        {footer && <div className="text-center">{footer}</div>}
      </div>
    </div>
  )}


