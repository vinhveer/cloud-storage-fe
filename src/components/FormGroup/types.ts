import type React from 'react'

export type FormGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  label?: string
  error?: string | null
  help?: string | null
}

export type FormFieldContextValue = {
  describedById?: string
  invalid?: boolean
}


