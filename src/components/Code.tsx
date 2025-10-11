import { getHighlighter } from '@/lib/highlight'
import { copyTextToClipboard } from '@/utils/clipboard'

type CodeProps = {
  code: string
  language?: string
  className?: string
  showHeader?: boolean
}

export default function Code({ code, language, className, showHeader = true }: CodeProps) {
  const hljs = getHighlighter()
  const copy = async () => { await copyTextToClipboard(code) }

  const detected = language
    ? { language, value: hljs.highlight(code, { language }).value }
    : hljs.highlightAuto(code)

  return (
    <div className={`rounded-md border border-gray-200 overflow-hidden max-w-full ${className ?? ''}`}>
      {showHeader && (
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
          <span className="text-xs uppercase tracking-wide text-gray-500">{detected.language ?? 'code'}</span>
          <button
            type="button"
            onClick={copy}
            className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-100 active:bg-gray-200"
            aria-label="Copy code"
          >
            Copy
          </button>
        </div>
      )}
      <pre className="bg-white p-3 text-sm overflow-x-auto whitespace-pre-wrap break-words max-w-full">
        <code className={`hljs language-${detected.language ?? ''}`} dangerouslySetInnerHTML={{ __html: detected.value }} />
      </pre>
    </div>
  )
}


