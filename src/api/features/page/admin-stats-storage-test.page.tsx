import React from 'react'
import { useAdminStorageStats } from '@/api/features/stats/stats.queries'

export default function AdminStatsStorageTestPage() {
  const [startDate, setStartDate] = React.useState<string>('')
  const [endDate, setEndDate] = React.useState<string>('')

  const params = React.useMemo(
    () => ({
      start_date: startDate === '' ? undefined : startDate,
      end_date: endDate === '' ? undefined : endDate,
    }),
    [startDate, endDate],
  )

  const query = useAdminStorageStats(params)

  const runQuick = (mode: 'default' | 'range' | 'single' | 'invalid') => {
    if (mode === 'default') {
      setStartDate('')
      setEndDate('')
      return
    }
    if (mode === 'range') {
      setStartDate('2025-10-25')
      setEndDate('2025-10-31')
      return
    }
    if (mode === 'single') {
      setStartDate('2025-10-15')
      setEndDate('')
      return
    }
    setStartDate('2025-13-01')
    setEndDate('')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Admin Storage Stats Test</h1>
      <form
        onSubmit={event => {
          event.preventDefault()
          query.refetch()
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          maxWidth: 360,
          padding: 16,
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
        }}
      >
        <label>
          Start date (YYYY-MM-DD):
          <input
            type="text"
            value={startDate}
            onChange={event => setStartDate(event.target.value)}
            placeholder="e.g. 2025-10-25"
          />
        </label>
        <label>
          End date (YYYY-MM-DD, optional):
          <input
            type="text"
            value={endDate}
            onChange={event => setEndDate(event.target.value)}
            placeholder="e.g. 2025-10-31"
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
          onClick={() => runQuick('default')}
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
          Quick: default (no dates)
        </button>
        <button
          type="button"
          onClick={() => runQuick('range')}
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
          Quick: range (2025-10-25 → 2025-10-31)
        </button>
        <button
          type="button"
          onClick={() => runQuick('single')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#f59e0b',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: single day (2025-10-15)
        </button>
        <button
          type="button"
          onClick={() => runQuick('invalid')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#dc2626',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: invalid date (500)
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


