import React from 'react'
import { useUserDashboardStats } from '@/api/features/user-dashboard/user-dashboard.queries'

export default function DashboardStatsTestPage() {
  const [startDate, setStartDate] = React.useState<string>('2025-11-01')
  const [endDate, setEndDate] = React.useState<string>('2025-11-10')

  const params = React.useMemo(
    () => ({
      start_date: startDate === '' ? undefined : startDate,
      end_date: endDate === '' ? undefined : endDate,
    }),
    [startDate, endDate],
  )

  const query = useUserDashboardStats(params)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()
    query.refetch()
  }

  const runQuick = (mode: 'range' | 'only-start' | 'only-end' | 'invalid') => {
    if (mode === 'range') {
      setStartDate('2025-11-01')
      setEndDate('2025-11-10')
      return
    }
    if (mode === 'only-start') {
      setStartDate('2025-11-10')
      setEndDate('')
      return
    }
    if (mode === 'only-end') {
      setStartDate('')
      setEndDate('2025-11-10')
      return
    }
    setStartDate('10-11-2025')
    setEndDate('')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Dashboard Stats Test</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          maxWidth: 420,
          padding: 16,
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
        }}
      >
        <label>
          Start date (Y-m-d, optional):
          <input
            type="text"
            value={startDate}
            onChange={event => setStartDate(event.target.value)}
          />
        </label>
        <label>
          End date (Y-m-d, optional):
          <input
            type="text"
            value={endDate}
            onChange={event => setEndDate(event.target.value)}
          />
        </label>
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
          {query.isFetching ? 'Loading...' : 'Fetch stats'}
        </button>
      </form>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => runQuick('range')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#16a34a',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: range 2025-11-01 → 2025-11-10
        </button>
        <button
          type="button"
          onClick={() => runQuick('only-start')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#0ea5e9',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: only start_date
        </button>
        <button
          type="button"
          onClick={() => runQuick('only-end')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#6366f1',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: only end_date
        </button>
        <button
          type="button"
          onClick={() => runQuick('invalid')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#f97316',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: invalid date (500 INTERNAL_ERROR)
        </button>
      </div>

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


