import React from 'react'
import FileList from './FileList'
import type { FileItem, ViewMode } from '@/components/FileList/types'
import { Button } from '@/components/Button/Button'

const sampleFiles: FileItem[] = [
  { name: 'Report Q1.pdf', type: 'PDF', modified: '2025-09-01', size: '1.2 MB' },
  { name: 'Design.sketch', type: 'Sketch', modified: '2025-08-22', size: '24.1 MB' },
  { name: 'notes.txt', type: 'Text', modified: '2025-08-01', size: '8 KB' },
  { name: 'photo.png', type: 'Image', modified: '2025-07-14', size: '2.3 MB' },
  { name: 'backup.zip', type: 'Archive', modified: '2025-06-30', size: '512 MB' },
]

export function FileListUsageDemo() {
  const [mode, setMode] = React.useState<ViewMode>('list')
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="secondary" onClick={() => setMode('list')}>List</Button>
        <Button size="sm" variant="secondary" onClick={() => setMode('grid')}>Grid</Button>
        <Button size="sm" variant="secondary" onClick={() => setMode('tiles')}>Tiles</Button>
        <Button size="sm" variant="secondary" onClick={() => setMode('details')}>Details</Button>
      </div>
      <FileList files={sampleFiles} viewMode={mode} onViewModeChange={setMode} />
    </div>
  )
}


export function FileListHeightDemo() {
  const [mode, setMode] = React.useState<ViewMode>('list')
  const longFiles: FileItem[] = React.useMemo(() => (
    Array.from({ length: 40 }, (_, i) => {
      const base = sampleFiles[i % sampleFiles.length]
      return { ...base, id: i, name: `${base.name} ${i + 1}` }
    })
  ), [])
  return (
    <div className="space-y-3">
      <FileList files={longFiles} viewMode={mode} onViewModeChange={setMode} heightVh={60} />
    </div>
  )
}


