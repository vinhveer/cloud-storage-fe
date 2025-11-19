import React from 'react'
import { useConfigByKey } from '@/api/features/config/config.queries'

export default function AdminConfigDetailTestPage() {
    const [configKey, setConfigKey] = React.useState<string>('max_upload_size')

    const query = useConfigByKey(configKey === '' ? undefined : configKey)

    const runQuick = (mode: 'exists' | 'not-found' | 'clear') => {
        if (mode === 'exists') {
            setConfigKey('max_upload_size')
            return
        }
        if (mode === 'not-found') {
            setConfigKey('non_existing_key_123')
            return
        }
        setConfigKey('')
    }

    return (
        <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
            <h1>Admin Config Detail Test</h1>
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
                    Config key:
                    <input
                        type="text"
                        value={configKey}
                        onChange={event => setConfigKey(event.target.value)}
                    />
                </label>
                <button
                    type="submit"
                    disabled={query.isFetching || !configKey}
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
                    {query.isFetching ? 'Loading...' : 'Fetch config'}
                </button>
            </form>

            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                    type="button"
                    onClick={() => runQuick('exists')}
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
                    Quick: exists (max_upload_size)
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
                <button
                    type="button"
                    onClick={() => runQuick('clear')}
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
                    Clear
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


