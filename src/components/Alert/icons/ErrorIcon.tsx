import type { CSSProperties } from 'react'

type Props = { className?: string; style?: CSSProperties }

export default function ErrorIcon({ className, style }: Props) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
      <g transform="translate(0,-1.25)">
        <path d="M9 6h2v6H9V6z" fill="#fff" />
        <path d="M9 14h2v2H9v-2z" fill="#fff" />
      </g>
    </svg>
  )
}
