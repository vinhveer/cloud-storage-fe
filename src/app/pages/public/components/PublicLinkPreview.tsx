import { useEffect, useRef, useState } from 'react'
import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { getPublicLinkDownload } from '@/api/features/public-link/public-link.api'
import { useAlert } from '@/components/Alert/AlertProvider'
import Loading from '@/components/Loading/Loading'
import FilePreview from 'reactjs-file-preview'
import { getHighlighter } from '@/components/MDX/highlight'
import Offcanvas from '@/components/Offcanvas/Offcanvas'
import type { PublicLinkPreviewData } from '@/api/features/public-link/public-link.types'

interface PublicLinkPreviewProps {
  data: PublicLinkPreviewData
  token: string
  open: boolean
  onClose: () => void
}

function getProxyUrl(url: string): string {
  if (import.meta.env.DEV && url.startsWith('https://cloud.nguyenquangvinh.id.vn/storage')) {
    return url.replace('https://cloud.nguyenquangvinh.id.vn/storage', '/storage')
  }
  return url
}

function getFileExtension(fileName: string): string {
  const parts = fileName.split('.')
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
}

function isCodeFile(fileName: string, mimeType?: string): boolean {
  const extension = getFileExtension(fileName)
  const codeExtensions = [
    'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'h', 'hpp',
    'cs', 'php', 'rb', 'go', 'rs', 'swift', 'kt', 'scala', 'r',
    'sql', 'sh', 'bash', 'zsh', 'fish', 'ps1', 'bat', 'cmd',
    'html', 'css', 'scss', 'sass', 'less', 'xml', 'json', 'yaml', 'yml',
    'md', 'markdown', 'txt', 'log', 'conf', 'config', 'ini', 'env',
    'vue', 'svelte', 'dart', 'lua', 'pl', 'pm', 'r', 'm', 'mm',
    'gradle', 'properties', 'toml', 'lock', 'dockerfile', 'makefile'
  ]

  if (codeExtensions.includes(extension)) return true
  if (mimeType?.startsWith('text/')) return true
  if (mimeType === 'application/json' || mimeType === 'application/xml') return true

  return false
}

function getLanguageFromExtension(fileName: string): string {
  const extension = getFileExtension(fileName)
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'tsx',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'h': 'c',
    'hpp': 'cpp',
    'cs': 'csharp',
    'php': 'php',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'sql': 'sql',
    'sh': 'bash',
    'bash': 'bash',
    'zsh': 'bash',
    'fish': 'bash',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'sass',
    'less': 'css',
    'xml': 'xml',
    'json': 'json',
    'yaml': 'yaml',
    'yml': 'yaml',
    'md': 'markdown',
    'markdown': 'markdown',
    'txt': '',
    'log': '',
    'conf': '',
    'config': '',
    'env': '',
    'lock': 'json',
  }

  return languageMap[extension] || ''
}

export default function PublicLinkPreview({ data, token, open, onClose }: PublicLinkPreviewProps) {
  const { showAlert } = useAlert()
  const [textContent, setTextContent] = useState<string | null>(null)
  const [textLoading, setTextLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const codeRef = useRef<HTMLElement>(null)

  const file = data.file
  const previewUrl = file.url ? getProxyUrl(file.url) : null
  const displayFileName = file.display_name || 'file'
  const mimeType = file.mime_type
  const isCode = isCodeFile(displayFileName, mimeType)
  const language = isCode ? getLanguageFromExtension(displayFileName) : 'plaintext'

  useEffect(() => {
    if (!open) {
      setTextContent(null)
      setTextLoading(false)
      return
    }

    if (isCode && !textContent && !textLoading) {
      setTextLoading(true)

      if (previewUrl) {
        fetch(previewUrl)
          .then(res => {
            if (res.ok) {
              return res.text()
            }
            throw new Error('Preview URL failed')
          })
          .then(text => {
            setTextContent(text)
            setTextLoading(false)
          })
          .catch(() => {
            getPublicLinkDownload(token)
              .then(data => {
                return fetch(data.download_url).then(res => res.text())
              })
              .then(text => {
                setTextContent(text)
                setTextLoading(false)
              })
              .catch(() => {
                setTextLoading(false)
              })
          })
      } else {
        getPublicLinkDownload(token)
          .then(data => {
            return fetch(data.download_url).then(res => res.text())
          })
          .then(text => {
            setTextContent(text)
            setTextLoading(false)
          })
          .catch(() => {
            setTextLoading(false)
          })
      }
    }
  }, [open, previewUrl, isCode, textContent, textLoading, token])

  useEffect(() => {
    if (codeRef.current && textContent && language) {
      const hljs = getHighlighter()
      try {
        hljs.highlightElement(codeRef.current)
      } catch {
        // If highlighting fails, just display plain text
      }
    }
  }, [textContent, language])

  const handleDownload = async () => {
    try {
      setDownloadLoading(true)
      const downloadData = await getPublicLinkDownload(token)
      const response = await fetch(downloadData.download_url)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = displayFileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showAlert({ type: 'success', message: 'File downloaded successfully.' })
    } catch {
      showAlert({ type: 'error', message: 'Failed to download file. Please try again.' })
    } finally {
      setDownloadLoading(false)
    }
  }

  const renderContent = () => {
    if (isCode) {
      return (
        <div className="w-full h-full min-h-[calc(100vh-120px)] overflow-auto bg-white dark:bg-gray-900">
          {textLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loading size="lg" />
            </div>
          ) : textContent ? (
            <pre className="m-0 p-6 text-sm overflow-x-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              <code
                ref={codeRef}
                className={language ? `language-${language}` : ''}
              >
                {textContent}
              </code>
            </pre>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Unable to load file content
              </p>
            </div>
          )}
        </div>
      )
    } else if (previewUrl) {
      return (
        <div className="w-full h-full min-h-[calc(100vh-120px)] bg-white dark:bg-gray-900">
          <FilePreview preview={previewUrl} />
        </div>
      )
    } else {
      return (
        <div className="text-center py-12 space-y-4 bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Preview not available for this file type
          </p>
        </div>
      )
    }
  }

  return (
    <Offcanvas
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      width="100"
      alignment="right"
      title=""
      closeButton={false}
      className="!p-0 flex flex-col"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800 gap-2 flex-shrink-0 bg-white dark:bg-gray-900">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white leading-6 break-words flex-1 min-w-0 truncate">
          {displayFileName || 'File Preview'}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloadLoading}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{downloadLoading ? 'Downloading...' : 'Download'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all"
            aria-label="Close preview"
          >
            <XMarkIcon className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-white dark:bg-gray-900 min-h-0">
        {renderContent()}
      </div>
    </Offcanvas>
  )
}


