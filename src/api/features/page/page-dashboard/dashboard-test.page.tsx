import { useUserDashboardOverview } from '@/api/features/user-dashboard/user-dashboard.queries'

export default function DashboardTestPage() {
  const query = useUserDashboardOverview()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()
    query.refetch()
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Dashboard Overview Test</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          maxWidth: 400,
          padding: 16,
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
        }}
      >
        <button
          type="submit"
          disabled={query.isFetching}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: query.isFetching ? 'not-allowed' : 'pointer',
            backgroundColor: query.isFetching ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {query.isFetching ? 'Loading...' : 'Fetch dashboard'}
        </button>
      </form>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {query.isError && (
          <pre
            style={{
              marginTop: 8,
              padding: 12,
              borderRadius: 8,
              backgroundColor: '#fef2f2',
              color: '#b91c1c',
              fontSize: 12,
              overflowX: 'auto',
            }}
          >
            {JSON.stringify(query.error, null, 2)}
          </pre>
        )}
        {query.isSuccess && (
          <pre
            style={{
              marginTop: 8,
              padding: 12,
              borderRadius: 8,
              backgroundColor: '#ecfdf3',
              color: '#166534',
              fontSize: 12,
              overflowX: 'auto',
            }}
          >
            {JSON.stringify(query.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}


