import { Link } from '@tanstack/react-router'
import { sampleMenuItems, samplesTitle, samplesIntro } from '@data/sample-data.mock'

export default function SamplesPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">{samplesTitle}</h1>
      <p className="text-gray-700">{samplesIntro}</p>
      <ul className="list-disc pl-6 space-y-1">
        {sampleMenuItems.map(item => (
          <li key={item.href}>
            <Link to={item.href} className="text-blue-600 hover:underline">
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}


