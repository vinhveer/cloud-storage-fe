import type { CSSProperties } from 'react'

type Props = { className?: string; style?: CSSProperties }

export default function InfoIcon({ className, style }: Props) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM9 8h2v5H9V8Zm0 6h2v2H9v-2Z" clipRule="evenodd" />
    </svg>
  )
}
