import { Link } from '@tanstack/react-router'
import { sampleMenuItems, samplesTitle } from '@data/sample-data.mock'

export default function SampleSidebar() {
  return (
    <aside className="w-56 shrink-0 p-4 border-r border-gray-200">
      <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{samplesTitle}</h2>
      <nav className="mt-3 space-y-2">
        {sampleMenuItems.map(item => (
          <Link
            key={item.href}
            to={item.href}
            activeProps={{
              'aria-current': 'page',
              className:
                'block rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
            }}
            inactiveProps={{
              className:
                'block rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500',
            }}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  )
}


