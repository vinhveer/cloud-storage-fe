import { useEffect, useState } from 'react'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import { listTrash } from '@/api/features/trash/trash.api'
import type { TrashItem } from '@/api/features/trash/trash.types'

export default function TestTrashPage() {
  const [data, setData] = useState<TrashItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function fetchTrash() {
    setLoading(true)
    setError(null)
    try {
      const res = await listTrash({ page: 1, per_page: 15 })
      setData(res.items)
    } catch (e: any) {
      setError(e?.message ?? String(e))
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // auto-fetch once for convenience
    fetchTrash()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ id: 'test-trash', label: 'Test Trash API' }]} />

      <header>
        <h2 className="text-2xl font-semibold">Test: GET /api/trash</h2>
        <p className="text-sm text-gray-600">Fetches combined trash for current user and shows raw items.</p>
      </header>

      <div>
        <button
          onClick={fetchTrash}
          className="px-3 py-1.5 rounded border bg-white dark:bg-gray-900"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Fetch /api/trash'}
        </button>
      </div>

      <section>
        {error && <pre className="text-red-600">{error}</pre>}

        {data ? (
          <div className="overflow-auto">
            <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
          </div>
        ) : (
          !loading && <p className="text-sm text-gray-500">No data yet.</p>
        )}
      </section>
    </div>
  )
}
