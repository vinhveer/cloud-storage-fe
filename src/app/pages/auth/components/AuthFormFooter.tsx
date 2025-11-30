import { Link } from '@tanstack/react-router'

type AuthFormFooterProps = {
  text: string
  linkText: string
  linkTo: string
  className?: string
}

export default function AuthFormFooter({
  text,
  linkText,
  linkTo,
  className,
}: AuthFormFooterProps) {
  return (
    <p className={`text-sm text-gray-600 dark:text-gray-400 ${className || ''}`}>
      {text}{' '}
      <Link to={linkTo} className="text-blue-600 dark:text-blue-400 hover:underline">
        {linkText}
      </Link>
    </p>
  )
}

