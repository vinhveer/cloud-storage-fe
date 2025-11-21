import React from 'react'
import { useSearchSuggestions } from '@/api/features/search/search.queries'

export default function SearchSuggestionsTestPage() {
  const [q, setQ] = React.useState<string>('')
  const [type, setType] = React.useState<string>('all')
  const [limit, setLimit] = React.useState<string>('5')

  const params = React.useMemo(
    () =>
      q.trim() === ''
        ? null
        : {
            q,
            type: type === '' ? undefined : (type as 'file' | 'folder' | 'all'),
            limit: limit === '' ? undefined : Number(limit),
          },
    [q, type, limit],
  )

  const query = useSearchSuggestions(params)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()
    query.refetch()
  }

  const runQuick = (mode: 'missing-q' | 'files-only' | 'folders-only' | 'all' | 'limit-clamp') => {
    if (mode === 'missing-q') {
      setQ('')
      setType('all')
      setLimit('5')
      return
    }

    if (mode === 'files-only') {
      setQ('b')
      setType('file')
      setLimit('1')
      return
    }

    if (mode === 'folders-only') {
      setQ('r')
      setType('folder')
      setLimit('2')
      return
    }

    if (mode === 'all') {
      setQ('r')
      setType('all')
      setLimit('10')
      return
    }

    setQ('a')
    setType('all')
    setLimit('200')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Search Suggestions Test</h1>
      <form
        onSubmit={handleSubmit}
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
          Query (q):
          <input
            type="text"
            value={q}
            onChange={event => setQ(event.target.value)}
          />
        </label>
        <label>
          Type (file | folder | all):
          <select
            value={type}
            onChange={event => setType(event.target.value)}
          >
            <option value="all">all</option>
            <option value="file">file</option>
            <option value="folder">folder</option>
          </select>
        </label>
        <label>
          Limit:
          <input
            type="number"
            value={limit}
            onChange={event => setLimit(event.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={query.isLoading}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: query.isLoading ? 'not-allowed' : 'pointer',
            backgroundColor: query.isLoading ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {query.isLoading ? 'Loading...' : 'Fetch suggestions'}
        </button>
      </form>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => runQuick('missing-q')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#eab308',
            color: '#1f2937',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: missing q (422)
        </button>
        <button
          type="button"
          onClick={() => runQuick('files-only')}
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
          Quick: files only (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('folders-only')}
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
          Quick: folders only (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('all')}
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
          Quick: all (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('limit-clamp')}
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
          Quick: limit=200 (422)
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


