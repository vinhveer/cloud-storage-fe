import { loadingSizePixels } from './sizing'
import clsx from 'clsx'
import type { LoadingProps } from '@/components/Loading/types'

export default function Loading({ size = 'md', className, ariaLabel = 'Loading' }: Readonly<LoadingProps>) {
  const px = loadingSizePixels[size]
  return (
    <output aria-label={ariaLabel} className={clsx('not-prose', className)}>
      <span
        className="inline-block animate-spin rounded-full border-2 border-current border-t-transparent"
        style={{ width: px, height: px }}
      />
    </output>
  )
}


