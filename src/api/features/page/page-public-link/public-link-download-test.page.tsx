import React from 'react'
import { usePublicLinkDownload } from '@/api/features/public-link/public-link.queries'

export default function PublicLinkDownloadTestPage() {
  const [token, setToken] = React.useState<string>('')

  const query = usePublicLinkDownload(token || null)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    if (!token.trim()) {
      alert('Token is required')
      return
    }

    query.refetch()
  }

  const runQuick = (mode: 'success' | 'forbidden' | 'invalid') => {
    if (mode === 'success') {
      setToken('KYrlWVyFFgyvhtEXiBgFG3ucN3UjHUkIK7ppaYpe')
      return
    }

    if (mode === 'forbidden') {
      setToken('OBOnHuWnhJmPbrGOwNRUfBx92UHHR06Jxt01xhjG')
      return
    }

    setToken('INVALID_DOWNLOAD_TOKEN')
  }

  const openDownload = () => {
    if (query.data?.download_url) {
      window.open(query.data.download_url, '_blank')
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Public Link Download Test</h1>
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
          Public link token:
          <input
            type="text"
            value={token}
            onChange={event => setToken(event.target.value)}
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
          {query.isLoading ? 'Loading...' : 'Get download URL'}
        </button>
      </form>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => runQuick('success')}
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
          Quick: valid download token (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('forbidden')}
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
          Quick: permission denied (403)
        </button>
        <button
          type="button"
          onClick={() => runQuick('invalid')}
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
          Quick: invalid token (404)
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
          <>
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
            {query.data.download_url && (
              <button
                type="button"
                onClick={openDownload}
                style={{
                  marginTop: 12,
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: '#22c55e',
                  color: '#ffffff',
                  fontWeight: 600,
                }}
              >
                Open download URL in new tab
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}


