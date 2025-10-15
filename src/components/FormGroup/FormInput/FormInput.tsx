import React from 'react'
import clsx from 'clsx'
import { FormFieldContext } from '@/components/FormGroup/FormGroup'

export type FormInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'placeholder'> & {
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
}

export default function FormInput({
  type = 'text',
  placeholder = '',
  className,
  id,
  ...rest
}: FormInputProps) {
  const reactId = React.useId()
  const inputId = id ?? `inp-${reactId}`
  const field = React.useContext(FormFieldContext)

  const baseClasses = 'block w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2'
  const errorClasses = 'border border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
  const normalClasses = 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-700 focus:ring-blue-500 focus:border-transparent'

  const inputClasses = clsx(baseClasses, field?.invalid ? errorClasses : normalClasses, className)

  return (
    <input
      id={inputId}
      type={type}
      placeholder={placeholder}
      className={inputClasses}
      aria-invalid={field?.invalid}
      aria-describedby={field?.describedById}
      {...rest}
    />
  )
}


