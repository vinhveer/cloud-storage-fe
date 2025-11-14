import type React from 'react'

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


