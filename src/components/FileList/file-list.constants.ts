import type { ComponentType } from 'react'
import {
  ListBulletIcon,
  Squares2X2Icon,
  RectangleGroupIcon,
  Bars3BottomLeftIcon,
} from '@heroicons/react/24/outline'
import type { ViewMode } from '@/components/FileList/types'

export type ViewModeConfig = {
  label: string
  icon: ComponentType<{ className?: string }>
}

export const viewModeConfigs: Record<ViewMode, ViewModeConfig> = {
  list: { label: 'List View', icon: ListBulletIcon },
  grid: { label: 'Grid View', icon: Squares2X2Icon },
  tiles: { label: 'Tiles View', icon: RectangleGroupIcon },
  details: { label: 'Details View', icon: Bars3BottomLeftIcon },
}


