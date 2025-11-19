import React from 'react'
import { useListFiles } from '@/api/features/file/file.queries'

export default function ListFilesTestPage() {
  const [folderId, setFolderId] = React.useState<string>('')
  const [search, setSearch] = React.useState<string>('')
  const [extension, setExtension] = React.useState<string>('pdf')
  const [page, setPage] = React.useState<string>('1')
  const [perPage, setPerPage] = React.useState<string>('10')

  const params = React.useMemo(
    () => ({
      folder_id: folderId === '' ? undefined : Number(folderId),
      search: search === '' ? undefined : search,
      extension: extension === '' ? undefined : extension,
      page: page === '' ? undefined : Number(page),
      per_page: perPage === '' ? undefined : Number(perPage),
    }),
    [folderId, search, extension, page, perPage],
  )

  const query = useListFiles(params)

  const runQuick = (mode: 'default' | 'folder' | 'search' | 'extension' | 'combined' | 'invalid-per-page' | 'folder-not-found') => {
    if (mode === 'default') {
      setFolderId('')
      setSearch('')
      setExtension('')
      setPage('1')
      setPerPage('10')
      return
    }

    if (mode === 'folder') {
      setFolderId('29')
      setSearch('')
      setExtension('')
      setPage('1')
      setPerPage('10')
      return
    }

    if (mode === 'search') {
      setFolderId('')
      setSearch('b')
      setExtension('')
      setPage('1')
      setPerPage('10')
      return
    }

    if (mode === 'extension') {
      setFolderId('')
      setSearch('')
      setExtension('pdf')
      setPage('1')
      setPerPage('10')
      return
    }

    if (mode === 'combined') {
      setFolderId('29')
      setSearch('b')
      setExtension('pdf')
      setPage('1')
      setPerPage('10')
      return
    }

    if (mode === 'invalid-per-page') {
      setPerPage('0')
      return
    }

    setFolderId('999999999')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>List Files Test</h1>
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
          Folder ID:
          <input
            type="number"
            value={folderId}
            onChange={event => setFolderId(event.target.value)}
          />
        </label>
        <label>
          Search (name keyword):
          <input
            type="text"
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
        </label>
        <label>
          Extension:
          <input
            type="text"
            value={extension}
            onChange={event => setExtension(event.target.value)}
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
          {query.isFetching ? 'Loading...' : 'Fetch files'}
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
          onClick={() => runQuick('folder')}
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
          Quick: folder_id=29
        </button>
        <button
          type="button"
          onClick={() => runQuick('search')}
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
          Quick: search=b
        </button>
        <button
          type="button"
          onClick={() => runQuick('extension')}
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
          Quick: extension=pdf
        </button>
        <button
          type="button"
          onClick={() => runQuick('combined')}
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
          Quick: folder+search+extension
        </button>
        <button
          type="button"
          onClick={() => runQuick('invalid-per-page')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#facc15',
            color: '#1f2937',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: per_page=0 (422)
        </button>
        <button
          type="button"
          onClick={() => runQuick('folder-not-found')}
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
          Quick: folder_id=999999999 (404)
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


