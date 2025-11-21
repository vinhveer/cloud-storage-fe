import React from 'react'
import { useUpdateConfigByKey } from '@/api/features/config/config.mutations'

export default function AdminConfigUpdateTestPage() {
  const [configKey, setConfigKey] = React.useState<string>('max_upload_size')
  const [configValue, setConfigValue] = React.useState<string>('209715200')
  const mutation = useUpdateConfigByKey(configKey)

  const runQuick = (mode: 'success' | 'missing-value' | 'not-found' | 'unauthenticated') => {
    if (mode === 'success') {
      setConfigKey('max_upload_size')
      setConfigValue('209715200')
      return
    }
    if (mode === 'missing-value') {
      setConfigKey('max_file_size')
      setConfigValue('')
      return
    }
    if (mode === 'not-found') {
      setConfigKey('non_existing_key_123')
      setConfigValue('some_value')
      return
    }
    // unauthenticated: user should logout manually to test; keep values
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Admin Config Update Test</h1>
      <form
        onSubmit={event => {
          event.preventDefault()
          mutation.mutate({ config_value: configValue })
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
          Config key:
          <input
            type="text"
            value={configKey}
            onChange={event => setConfigKey(event.target.value)}
          />
        </label>
        <label>
          Config value:
          <input
            type="text"
            value={configValue}
            onChange={event => setConfigValue(event.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={mutation.isPending || !configKey}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: mutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: mutation.isPending ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {mutation.isPending ? 'Updating...' : 'Update config'}
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
          Quick: success
        </button>
        <button
          type="button"
          onClick={() => runQuick('missing-value')}
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
          Quick: missing value (500)
        </button>
        <button
          type="button"
          onClick={() => runQuick('not-found')}
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
          Quick: not found (404)
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {mutation.isError && (
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
            {JSON.stringify(mutation.error, null, 2)}
          </pre>
        )}
        {mutation.isSuccess && (
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
            {JSON.stringify(mutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}


