import React from 'react'
import { useListFolders } from '@/api/features/folder/folder.queries'

export default function ListFoldersTestPage() {
  const [parentId, setParentId] = React.useState<string>('')
  const [page, setPage] = React.useState<string>('1')
  const [perPage, setPerPage] = React.useState<string>('10')

  const numericParentId = parentId === '' ? undefined : Number(parentId)
  const numericPage = Number(page)
  const numericPerPage = Number(perPage)

  const query = useListFolders({
    parent_id: numericParentId,
    page: Number.isNaN(numericPage) ? undefined : numericPage,
    per_page: Number.isNaN(numericPerPage) ? undefined : numericPerPage,
  })

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    if (parentId !== '' && (numericParentId === undefined || Number.isNaN(numericParentId))) {
      alert('Parent ID must be a number')
      return
    }

    if (page !== '' && Number.isNaN(numericPage)) {
      alert('Page must be a number')
      return
    }

    if (perPage !== '' && Number.isNaN(numericPerPage)) {
      alert('Per page must be a number')
      return
    }

    query.refetch()
  }

  const runQuick = (
    mode: 'root' | 'children' | 'pagination' | 'parent-not-found' | 'unauth',
  ) => {
    if (mode === 'root') {
      setParentId('')
      setPage('1')
      setPerPage('10')
      return
    }

    if (mode === 'children') {
      setParentId('29')
      setPage('1')
      setPerPage('10')
      return
    }

    if (mode === 'pagination') {
      setParentId('29')
      setPage('1')
      setPerPage('1')
      return
    }

    if (mode === 'parent-not-found') {
      setParentId('999999')
      setPage('1')
      setPerPage('10')
      return
    }

    setParentId('')
    setPage('1')
    setPerPage('10')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>List Folders Test</h1>
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
          Parent ID (empty = root):
          <input
            type="number"
            value={parentId}
            onChange={event => setParentId(event.target.value)}
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
          {query.isLoading ? 'Loading...' : 'Fetch folders'}
        </button>
      </form>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => runQuick('root')}
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
          Quick: root folders (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('children')}
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
          Quick: children of 29 (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('pagination')}
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
          Quick: pagination (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('parent-not-found')}
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
          Quick: parent not found (404)
        </button>
        <button
          type="button"
          onClick={() => runQuick('unauth')}
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
          Quick: unauth (401)
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


