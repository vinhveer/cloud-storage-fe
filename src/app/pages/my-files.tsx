import { useState } from 'react'

import FileList from '@/components/FileList'
import type { FileItem } from '@/components/FileList'

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

  const title = isRoot ? 'My files' : 'Designer'
  const subtitle = isRoot
    ? 'Danh sách thư mục và tệp của bạn.'
    : 'Các tệp bên trong thư mục Designer.'

  return (
    <div className="space-y-6">

      <header>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
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


