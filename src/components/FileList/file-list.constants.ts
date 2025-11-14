import type React from 'react'
import {
  ListBulletIcon,
  Squares2X2Icon,
  RectangleGroupIcon,
  Bars3BottomLeftIcon,
} from '@heroicons/react/24/outline'
import type { ViewMode } from '@/components/FileList/types'

export const viewModes: Record<ViewMode, { label: string; icon: React.ReactNode }> = {
  list: { label: 'List View', icon: <ListBulletIcon className="w-4 h-4" /> },
  grid: { label: 'Grid View', icon: <Squares2X2Icon className="w-4 h-4" /> },
  tiles: { label: 'Tiles View', icon: <RectangleGroupIcon className="w-4 h-4" /> },
  details: { label: 'Details View', icon: <Bars3BottomLeftIcon className="w-4 h-4" /> },
}


