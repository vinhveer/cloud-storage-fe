import FileCard from '@/components/FileCard/FileCard'
import StorageUsage from '@/components/StorageUsage/StorageUsage'

type HomeFileCard = {
  id: string
  icon: 'folder' | 'file' | 'file-word' | 'file-excel' | 'file-image' | 'file-pdf'
  title: string
  subtitle: string
  href?: string
}

const homeCards: HomeFileCard[] = [
  {
    id: 'designer',
    icon: 'folder',
    title: 'Designer',
    subtitle: 'Folder · 3 items',
    href: '/my-files',
  },
  {
    id: 'reports',
    icon: 'file-excel',
    title: 'Reports Q4',
    subtitle: 'Excel · 5 files',
    href: '/my-files',
  },
  {
    id: 'proposal',
    icon: 'file-word',
    title: 'Proposal.docx',
    subtitle: 'Word · Last edited yesterday',
    href: '/my-files',
  },
  {
    id: 'spec',
    icon: 'file-pdf',
    title: 'API-spec.pdf',
    subtitle: 'PDF · 1.2 MB',
    href: '/my-files',
  },
  {
    id: 'preview',
    icon: 'file-image',
    title: 'Preview.png',
    subtitle: 'Image · 2.3 MB',
    href: '/my-files',
  },
]

export default function HomePage() {
  return (
    <div className="space-y-6">

      <header className="space-y-1">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Home</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tổng quan nhanh về dung lượng và các tệp gần đây.
        </p>
      </header>

      <section>
        <StorageUsage used={128} total={256} precision={1} />
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent files & folders</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {homeCards.map((card) => (
            <div key={card.id}>
              <FileCard
                icon={card.icon}
                title={card.title}
                subtitle={card.subtitle}
                detailsHref={card.href}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}



