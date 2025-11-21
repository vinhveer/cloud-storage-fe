import React from 'react'
import { useGlobalSearch } from '@/api/features/search/search.queries'
import type { SearchParams } from '@/api/features/search/search.api'

export default function GlobalSearchTestPage() {
  const [q, setQ] = React.useState<string>('')
  const [type, setType] = React.useState<string>('')
  const [extension, setExtension] = React.useState<string>('')
  const [sizeMin, setSizeMin] = React.useState<string>('')
  const [sizeMax, setSizeMax] = React.useState<string>('')
  const [dateFrom, setDateFrom] = React.useState<string>('')
  const [dateTo, setDateTo] = React.useState<string>('')
  const [page, setPage] = React.useState<string>('1')
  const [perPage, setPerPage] = React.useState<string>('10')

  const params = React.useMemo<SearchParams>(
    () => ({
      q: q === '' ? undefined : q,
      type: type === '' ? undefined : (type as 'file' | 'folder'),
      extension: extension === '' ? undefined : extension,
      size_min: sizeMin === '' ? undefined : Number(sizeMin),
      size_max: sizeMax === '' ? undefined : Number(sizeMax),
      date_from: dateFrom === '' ? undefined : dateFrom,
      date_to: dateTo === '' ? undefined : dateTo,
      page: page === '' ? undefined : Number(page),
      per_page: perPage === '' ? undefined : Number(perPage),
    }),
    [q, type, extension, sizeMin, sizeMax, dateFrom, dateTo, page, perPage],
  )

  const query = useGlobalSearch(params)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()
    query.refetch()
  }

  const runQuick = (mode: 'unauth' | 'basic' | 'files-filtered' | 'folders-only' | 'date-range' | 'pagination') => {
    if (mode === 'unauth') {
      setQ('')
      setType('')
      setExtension('')
      setSizeMin('')
      setSizeMax('')
      setDateFrom('')
      setDateTo('')
      setPage('1')
      setPerPage('10')
      return
    }

    if (mode === 'basic') {
      setQ('')
      setType('')
      setExtension('')
      setSizeMin('')
      setSizeMax('')
      setDateFrom('')
      setDateTo('')
      setPage('1')
      setPerPage('10')
      return
    }

    if (mode === 'files-filtered') {
      setQ('')
      setType('file')
      setExtension('pdf')
      setSizeMin('1024')
      setSizeMax('10485760')
      setDateFrom('')
      setDateTo('')
      setPage('1')
      setPerPage('10')
      return
    }

    if (mode === 'folders-only') {
      setQ('r')
      setType('folder')
      setExtension('')
      setSizeMin('')
      setSizeMax('')
      setDateFrom('')
      setDateTo('')
      setPage('1')
      setPerPage('10')
      return
    }

    if (mode === 'date-range') {
      setQ('')
      setType('')
      setExtension('')
      setSizeMin('')
      setSizeMax('')
      setDateFrom('2025-10-01')
      setDateTo('2025-11-15')
      setPage('1')
      setPerPage('10')
      return
    }

    // pagination
    setQ('r')
    setType('')
    setExtension('')
    setSizeMin('')
    setSizeMax('')
    setDateFrom('')
    setDateTo('')
    setPage('1')
    setPerPage('2')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Global Search Test</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          maxWidth: 520,
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
          Type (file | folder):
          <select
            value={type}
            onChange={event => setType(event.target.value)}
          >
            <option value="">(All)</option>
            <option value="file">file</option>
            <option value="folder">folder</option>
          </select>
        </label>
        <label>
          Extension:
          <input
            type="text"
            value={extension}
            onChange={event => setExtension(event.target.value)}
            placeholder="vd: pdf"
          />
        </label>
        <label>
          Size min (bytes):
          <input
            type="number"
            value={sizeMin}
            onChange={event => setSizeMin(event.target.value)}
          />
        </label>
        <label>
          Size max (bytes):
          <input
            type="number"
            value={sizeMax}
            onChange={event => setSizeMax(event.target.value)}
          />
        </label>
        <label>
          Date from (YYYY-MM-DD):
          <input
            type="text"
            value={dateFrom}
            onChange={event => setDateFrom(event.target.value)}
          />
        </label>
        <label>
          Date to (YYYY-MM-DD):
          <input
            type="text"
            value={dateTo}
            onChange={event => setDateTo(event.target.value)}
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
          {query.isLoading ? 'Loading...' : 'Run search'}
        </button>
      </form>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => runQuick('unauth')}
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
          Quick: unauth (401)
        </button>
        <button
          type="button"
          onClick={() => runQuick('basic')}
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
          Quick: basic search (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('files-filtered')}
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
          Quick: files only + extension + size (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('folders-only')}
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
          Quick: folders only (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('date-range')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#22c55e',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: date range (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('pagination')}
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
          Quick: pagination (200)
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


