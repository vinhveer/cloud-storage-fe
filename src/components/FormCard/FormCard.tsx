import clsx from 'clsx'
import Card from '@/components/Card/Card'
import { Button } from '@/components/Button/Button'
import type { FormCardProps } from '@/components/FormCard/types'

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
        'not-prose min-h-dvh overflow-y-auto flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8',
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
                  <Button onClick={onSubmitClick} variant={submitVariant} size="lg">{submitText}</Button>
                </div>
              )}
            </div>
          )}
        </Card>

        {footer && <div className="text-center">{footer}</div>}
      </div>
    </div>
  )}


