import { useState } from 'react'

import FileList from '@/components/FileList'
import type { FileItem } from '@/components/FileList'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'

const rootFiles: FileItem[] = [
  {
    id: 'designer',
    name: 'Designer',
    type: 'Folder',
    modified: 'October 21, 2024',
    itemsCount: 3,
  },
]

const designerFiles: FileItem[] = [
  {
    id: 'design-brief',
    name: 'Design brief.docx',
    type: 'Word',
    modified: 'October 22, 2024',
    size: '24 KB',
  },
  {
    id: 'wireframe',
    name: 'Wireframe.png',
    type: 'Image',
    modified: 'October 22, 2024',
    size: '2.3 MB',
  },
  {
    id: 'spec',
    name: 'Spec.pdf',
    type: 'PDF',
    modified: 'October 21, 2024',
    size: '1.2 MB',
  },
]

export default function MyFilesPage() {
  const [currentFolder, setCurrentFolder] = useState<'root' | 'designer'>('root')

  const isRoot = currentFolder === 'root'
  const files = isRoot ? rootFiles : designerFiles

  return (
    <div className="space-y-6">

      <header>
        <Breadcrumb
          items={[
            { id: 'my-files-root', label: 'My Files' },
            ...(isRoot
              ? []
              : [
                {
                  id: 'folder-designer',
                  label: 'Designer',
                },
              ]),
          ]}
          onItemClick={(item) => {
            if (item.id === 'my-files-root') {
              setCurrentFolder('root')
            }
          }}
        />
      </header>

      <section>
        <FileList
          files={files}
          viewMode="details"
          heightVh={60}
          onItemOpen={(file) => {
            if (isRoot && file.name === 'Designer') {
              setCurrentFolder('designer')
            }
          }}
        />
      </section>
    </div>
  )
}


