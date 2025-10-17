import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useSidebar } from '@/contexts/SidebarContext'
import { Squares2X2Icon } from '@heroicons/react/24/outline'
import { sampleMenuItems, samplesTitle, samplesIntro } from '@data/sample-data.mock'

export default function SamplesPage() {
  const { setItems, setActiveKey } = useSidebar()

  useEffect(() => {
    setItems(
      sampleMenuItems.map((m) => ({
        key: m.href,
        title: m.title,
        href: m.href,
        icon: <Squares2X2Icon className="w-5 h-5" />,
      }))
    )
    setActiveKey(undefined)
  }, [setItems, setActiveKey])
  return (
    <div className="space-y-4 text-gray-900 dark:text-gray-100">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="hover:underline text-blue-600 dark:text-blue-400">Home</Link>
          </li>
          <li>/</li>
          <li className="text-gray-700 dark:text-gray-300 font-medium">Samples</li>
        </ol>
      </nav>
      <h1 className="text-2xl font-bold">{samplesTitle}</h1>
      <p className="text-gray-700 dark:text-gray-300">{samplesIntro}</p>
      <ul className="list-disc pl-6 space-y-1">
        {sampleMenuItems.map(item => (
          <li key={item.href}>
            <Link to={item.href} className="text-blue-600 dark:text-blue-400 hover:underline">
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}


