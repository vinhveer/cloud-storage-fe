import { loadingSizePixels } from '@/constants/sizing'
type LoadingProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  ariaLabel?: string
}

export default function Loading({ size = 'md', className, ariaLabel = 'Loading' }: LoadingProps) {
  const px = loadingSizePixels[size]
  return (
    <span role="status" aria-label={ariaLabel} className={className}>
      <span
        className="inline-block animate-spin rounded-full border-2 border-current border-t-transparent"
        style={{ width: px, height: px }}
      />
    </span>
  )
}


