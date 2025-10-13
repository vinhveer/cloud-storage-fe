import React from 'react'
import clsx from 'clsx'

export type FormButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
}

export default function FormButton({
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  children,
  ...rest
}: FormButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out shadow-sm'

  const variantClass =
    variant === 'primary'
      ? 'bg-blue-600 hover:bg-blue-700 text-white border-0 focus:ring-blue-500'
      : variant === 'secondary'
      ? 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 focus:ring-blue-500'
      : variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 text-white border-0 focus:ring-red-500'
      : variant === 'success'
      ? 'bg-green-600 hover:bg-green-700 text-white border-0 focus:ring-green-500'
      : variant === 'warning'
      ? 'bg-yellow-600 hover:bg-yellow-700 text-white border-0 focus:ring-yellow-500'
      : 'bg-blue-600 hover:bg-blue-700 text-white border-0 focus:ring-blue-500'

  const sizeClass =
    size === 'sm'
      ? 'px-3 py-1.5 text-xs'
      : size === 'md'
      ? 'px-4 py-2 text-sm'
      : size === 'lg'
      ? 'px-6 py-3 text-base'
      : size === 'xl'
      ? 'px-8 py-4 text-lg'
      : 'px-4 py-2 text-sm'

  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      className={clsx('not-prose', baseClasses, variantClass, sizeClass, disabledClass, className)}
    >
      {children}
    </button>
  )
}


