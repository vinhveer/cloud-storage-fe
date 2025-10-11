import Loading from '@/components/Loading'

export function LoadingUsageDemo() {
  return (
    <div className="flex items-center gap-2">
      <Loading />
      <span className="text-sm text-gray-700">Loading data…</span>
    </div>
  )
}

export function LoadingSizesDemo() {
  return (
    <div className="flex items-end gap-3">
      <Loading size="sm" />
      <Loading size="md" />
      <Loading size="lg" />
      <Loading size="xl" />
      <Loading size="2xl" />
    </div>
  )
}


