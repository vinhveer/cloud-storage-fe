import type { CSSProperties } from 'react'

type Props = { className?: string; style?: CSSProperties }

export default function WarningIcon({ className, style }: Props) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.518 11.584c.75 1.333-.213 3-1.742 3H3.48c-1.53 0-2.492-1.667-1.742-3L8.257 3.1z" />
      <path d="M11 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 7h2v4H9V7z" fill="#fff" />
    </svg>
  )
}
