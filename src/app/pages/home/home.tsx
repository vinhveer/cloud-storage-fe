import Tabs from './components/Tabs'
import RecentFilesTab from './components/RecentFilesTab'
import StorageBreakdownTab from './components/StorageBreakdownTab'

export default function HomePage() {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Home</h2>
      <Tabs
        tabs={[
          {
            id: 'recent',
            label: 'Recent Files',
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

