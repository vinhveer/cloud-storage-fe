import { useState } from 'react'
import Subnav from '@/components/Subnav/Subnav'
import type { SubnavItem } from '@/components/Subnav/Subnav'
import { getDefaultFileIcon } from '@/components/FileList/file-list.icons'
import type { FileItem } from '@/components/FileList'

type SharedItem = FileItem & {
  owner: string
  sharedDate: string
}

const withYouData: SharedItem[] = [
  {
    id: 'report-group',
    name: 'nhom1_64cntt2_cnpm_baocao_baitapnhom',
    type: 'Word',
    owner: "thanh hieu's Files",
    sharedDate: 'Jun 5',
  },
  {
    id: 'thesis',
    name: 'DATN_VuMinhNga_63130803_2025',
    type: 'Word',
    owner: "Vu Nga's Files",
    sharedDate: 'May 25',
  },
  {
    id: 'plan-dalat',
    name: 'Plan Đi Đà Lạt',
    type: 'Excel',
    owner: "Xuân Hùng Hồ's Files",
    sharedDate: 'Dec 3, 2024',
  },
  {
    id: 'plan-dalat-copy',
    name: 'Plan Đi Đà Lạt (1)',
    type: 'Excel',
    owner: "Xuân Hùng Hồ's Files",
    sharedDate: 'Dec 3, 2024',
  },
]

const byYouData: SharedItem[] = [
  {
    id: 'design-spec',
    name: 'Design-spec-v2.pdf',
    type: 'PDF',
    owner: 'Shared by you',
    sharedDate: 'Nov 12, 2024',
  },
  {
    id: 'roadmap',
    name: 'Product-roadmap.pptx',
    type: 'PowerPoint',
    owner: 'Shared by you',
    sharedDate: 'Oct 2, 2024',
  },
]

const subnavItems: SubnavItem[] = [
  { id: 'with', label: 'With you' },
  { id: 'by', label: 'By you' },
]

type Tab = 'with' | 'by'


export default function SharedPage() {
  const [activeTab, setActiveTab] = useState<Tab>('with')

  const items = activeTab === 'with' ? withYouData : byYouData

  return (
    <div className="space-y-4">

      <header className="space-y-1">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Shared</h2>
        <p className="text-gray-600 dark:text-gray-400">Files that are shared with you or shared by you.</p>
      </header>

      <div className="flex items-center justify-between gap-4">
        <Subnav
          items={subnavItems}
          activeItem={activeTab}
          onItemClick={(item) => {
            if (item.id === 'with') setActiveTab('with')
            if (item.id === 'by') setActiveTab('by')
          }}
        />

      </div>

      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
          <div>
            {activeTab === 'with' ? 'With you' : 'By you'} · {items.length}{' '}
            {items.length === 1 ? 'item' : 'items'}
          </div>

        </div>

        <table className="min-w-full text-sm text-gray-900 dark:text-gray-100">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900">
              <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Name</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Date shared</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Shared by</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors cursor-pointer"
              >
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {getDefaultFileIcon(item, 'w-6 h-6')}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{item.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.owner}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{item.sharedDate}</td>
                <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{item.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}


