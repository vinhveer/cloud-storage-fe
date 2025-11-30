import Tabs from './components/Tabs'
import RecentFilesTab from './components/RecentFilesTab'
import StorageBreakdownTab from './components/StorageBreakdownTab'

export default function HomePage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Home</h2>
        <p className="text-gray-600 dark:text-gray-400">
          A quick overview of your storage usage and recently opened files.
        </p>
      </header>

      <Tabs
        tabs={[
          {
            id: 'recent',
            label: 'Recent Files and Folder',
            content: <RecentFilesTab />,
          },
          {
            id: 'breakdown',
            label: 'Storage Breakdown',
            content: <StorageBreakdownTab />,
          },
        ]}
        defaultTabId="recent"
      />
    </div>
  )
}

