import type { CSSProperties } from 'react'

type Props = { className?: string; style?: CSSProperties }

export default function ErrorIcon({ className, style }: Props) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
      <path d="M9 6h2v6H9V6zM9 14h2v2H9v-2z" fill="#fff" />
    </svg>
  )
}
