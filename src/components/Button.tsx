import React from "react"
import clsx from "clsx"
import Loading from "@/components/Loading"
import { buttonToSpinnerSize } from "@/constants/sizing"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger"
  size?: "sm" | "md" | "lg" | "xl" | "2xl"
  icon?: React.ReactNode
  value?: string
  isLoading?: boolean
  loadingText?: string
}

type ButtonContentProps = Pick<ButtonProps, 'icon' | 'value' | 'children' | 'isLoading' | 'loadingText' | 'size'>

function ButtonContent({ icon, value, children, isLoading, loadingText, size = 'md' }: ButtonContentProps) {
  if (isLoading) {
    return (
      <>
        <Loading
          className="mr-2 inline-flex"
          size={buttonToSpinnerSize[size]}
        />
        {loadingText ?? value ?? children ?? 'Loading'}
      </>
    )
  }
  return (
    <>
      {icon && value && (
        <>
          <span className="mr-2">{icon}</span>
          {value}
        </>
      )}
      {icon && !value && !children && icon}
      {value && !icon && value}
      {children}
    </>
  )
}

export const Button = ({
  variant = "primary",
  size = "md",
  icon,
  value,
  isLoading = false,
  loadingText,
  children,
  className,
  ...rest
}: ButtonProps) => {
  const isIconOnly = !!icon && !value && !children
  const sizeClass = isIconOnly ? `btn-icon-${size}` : `btn-${size}`
  const variantClass = `btn-${variant}`

  // Dev-only a11y guard: icon-only buttons must have aria-label
  try {
    const isDev = (typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV) ?? false
    if (isDev && isIconOnly && !(rest as Record<string, unknown>)["aria-label"]) {
      console.warn('Button: icon-only button requires an aria-label for accessibility.')
    }
  } catch {}

  return (
    <button
      {...rest}
      type={rest.type ?? "button"}
      disabled={rest.disabled || isLoading}
      className={clsx("btn", variantClass, sizeClass, className, isLoading && "opacity-80 cursor-not-allowed")}
    >
      <ButtonContent
        icon={icon}
        value={value}
        isLoading={isLoading}
        loadingText={loadingText}
        size={size}
      >
        {children}
      </ButtonContent>
    </button>
  )
}
