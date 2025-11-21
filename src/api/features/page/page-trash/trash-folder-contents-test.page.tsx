import React from 'react'
import { useTrashFolderContents } from '@/api/features/trash/trash.queries'
import type { GetTrashFolderContentsParams } from '@/api/features/trash/trash.api'

export default function TrashFolderContentsTestPage() {
  const [folderId, setFolderId] = React.useState<string>('')
  const [search, setSearch] = React.useState<string>('')
  const [page, setPage] = React.useState<string>('1')
  const [perPage, setPerPage] = React.useState<string>('3')

  const params = React.useMemo<GetTrashFolderContentsParams>(
    () => ({
      search: search === '' ? undefined : search,
      page: page === '' ? undefined : Number(page),
      per_page: perPage === '' ? undefined : Number(perPage),
    }),
    [search, page, perPage],
  )

  const folderIdNum = folderId === '' ? undefined : Number(folderId)
  const query = useTrashFolderContents(folderIdNum, params)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()
    query.refetch()
  }

  const runQuick = (
    mode: 'unauth' | 'basic' | 'search' | 'pagination' | 'not-found',
  ) => {
    if (mode === 'unauth') {
      setFolderId('')
      setSearch('')
      setPage('1')
      setPerPage('3')
      return
    }

    if (mode === 'basic') {
      setFolderId('34')
      setSearch('')
      setPage('1')
      setPerPage('3')
      return
    }

    if (mode === 'search') {
      setFolderId('34')
      setSearch('b')
      setPage('1')
      setPerPage('3')
      return
    }

    if (mode === 'pagination') {
      setFolderId('34')
      setSearch('')
      setPage('1')
      setPerPage('3')
      return
    }

    if (mode === 'not-found') {
      setFolderId('999999')
      setSearch('')
      setPage('1')
      setPerPage('3')
      return
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Trash Folder Contents Test</h1>
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
          Folder ID:
          <input
            type="number"
            value={folderId}
            onChange={event => setFolderId(event.target.value)}
            placeholder="Folder ID"
            min="1"
            required
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: 4,
              border: '1px solid #d1d5db',
              marginTop: 4,
            }}
          />
        </label>
        <label>
          Search:
          <input
            type="text"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search term"
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: 4,
              border: '1px solid #d1d5db',
              marginTop: 4,
            }}
          />
        </label>
        <label>
          Page:
          <input
            type="number"
            value={page}
            onChange={event => setPage(event.target.value)}
            min="1"
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: 4,
              border: '1px solid #d1d5db',
              marginTop: 4,
            }}
          />
        </label>
        <label>
          Per page:
          <input
            type="number"
            value={perPage}
            onChange={event => setPerPage(event.target.value)}
            min="1"
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: 4,
              border: '1px solid #d1d5db',
              marginTop: 4,
            }}
          />
        </label>
        <button
          type="submit"
          disabled={query.isLoading || !folderId}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: query.isLoading || !folderId ? 'not-allowed' : 'pointer',
            backgroundColor: query.isLoading || !folderId ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {query.isLoading ? 'Loading...' : 'Fetch folder contents'}
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
          Quick: basic (200)
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
          Quick: search (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('pagination')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#8b5cf6',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: pagination (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('not-found')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#ef4444',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: not found (404)
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

