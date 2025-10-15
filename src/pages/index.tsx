import { useEffect } from 'react'
import { useSidebar } from '@/contexts/SidebarContext'
import { HomeIcon, FolderIcon, ShareIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  const { setItems, setActiveKey } = useSidebar()

  useEffect(() => {
    setItems([
      { key: 'home', title: 'Home', href: '/', icon: <HomeIcon className="w-5 h-5" /> },
      { key: 'files', title: 'My Files', href: '#', icon: <FolderIcon className="w-5 h-5" /> },
      { key: 'shared', title: 'Shared', href: '#', icon: <ShareIcon className="w-5 h-5" /> },
      { key: 'trash', title: 'Trash', href: '#', icon: <TrashIcon className="w-5 h-5" /> },
    ])
    setActiveKey('home')
  }, [setItems, setActiveKey])

  return (
    <div>
      <h2 className="text-xl font-semibold">Hi!</h2>
      <p className="text-gray-600 mt-2">This is the home page.</p>
    </div>
  )
}


