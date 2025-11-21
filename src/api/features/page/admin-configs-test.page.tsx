import React from 'react'
import { useListConfigs } from '@/api/features/config/config.queries'

export default function AdminConfigsTestPage() {
  const [search, setSearch] = React.useState<string>('')
  const [page, setPage] = React.useState<string>('1')
  const [perPage, setPerPage] = React.useState<string>('10')

  const params = React.useMemo(
    () => ({
      search: search === '' ? undefined : search,
      page: page === '' ? undefined : Number(page),
      per_page: perPage === '' ? undefined : Number(perPage),
    }),
    [search, page, perPage],
  )

  const query = useListConfigs(params)

  const runQuick = (mode: 'default' | 'search' | 'custom-pagination') => {
    if (mode === 'default') {
      setSearch('')
      setPage('1')
      setPerPage('10')
      return
    }

    if (mode === 'search') {
      setSearch('max_upload_size')
      setPage('1')
      setPerPage('10')
      return
    }

    setSearch('')
    setPage('1')
    setPerPage('2')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Admin Configs Test</h1>
      <form
        onSubmit={event => {
          event.preventDefault()
          query.refetch()
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          maxWidth: 480,
          padding: 16,
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
        }}
      >
        <label>
          Search (config_key or config_value):
          <input
            type="text"
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
        </label>
        <label>
          Page:
          <input
            type="number"
            value={page}
            onChange={event => setPage(event.target.value)}
          />
        </label>
        <label>
          Per page:
          <input
            type="number"
            value={perPage}
            onChange={event => setPerPage(event.target.value)}
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
          {query.isFetching ? 'Loading...' : 'Fetch configs'}
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
          Quick: default list
        </button>
        <button
          type="button"
          onClick={() => runQuick('search')}
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
          Quick: search=max_upload_size
        </button>
        <button
          type="button"
          onClick={() => runQuick('custom-pagination')}
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
          Quick: page=1&per_page=2
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

