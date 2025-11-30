import React from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import FormInput from '@/components/FormGroup/FormInput/FormInput'
import type { FormInputProps } from '@/components/FormGroup/FormInput/types'

type PasswordInputProps = Omit<FormInputProps, 'type'> & {
  showToggle?: boolean
}

export default function PasswordInput({
  showToggle = true,
  ...inputProps
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false)

  if (!showToggle) {
    return <FormInput type="password" {...inputProps} />
  }

  return (
    <div className="relative">
      <FormInput
        type={showPassword ? 'text' : 'password'}
        {...inputProps}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeSlashIcon className="w-5 h-5" />
        ) : (
          <EyeIcon className="w-5 h-5" />
        )}
      </button>
    </div>
  )
}

