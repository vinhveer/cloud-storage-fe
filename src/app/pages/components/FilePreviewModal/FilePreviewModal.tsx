import { useEffect, useRef, useState } from 'react'
import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useFilePreview } from '@/api/features/file/file.queries'
import { useDownloadFile } from '@/api/features/file/file.mutations'
import { downloadFile } from '@/api/features/file/file.api'
import { useAlert } from '@/components/Alert/AlertProvider'
import Loading from '@/components/Loading/Loading'
import FilePreview from 'reactjs-file-preview'
import { getHighlighter } from '@/components/MDX/highlight'
import Offcanvas from '@/components/Offcanvas/Offcanvas'

interface FilePreviewModalProps {
  fileId: number | null
  fileName?: string
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

export default function FilePreviewModal({ fileId, fileName, open, onClose }: FilePreviewModalProps) {
  const { data: previewData, isLoading, error } = useFilePreview(open && fileId ? fileId : undefined)
  const downloadFileMutation = useDownloadFile()
  const { showAlert } = useAlert()
  const [textContent, setTextContent] = useState<string | null>(null)
  const [textLoading, setTextLoading] = useState(false)
  const codeRef = useRef<HTMLElement>(null)

  const previewUrl = previewData?.preview_url ? getProxyUrl(previewData.preview_url) : null
  const displayFileName = fileName || previewData?.file?.display_name || 'file'
  const mimeType = previewData?.file?.mime_type
  const isCode = isCodeFile(displayFileName, mimeType)
  const language = isCode ? getLanguageFromExtension(displayFileName) : 'plaintext'

  useEffect(() => {
    if (!open || !fileId) {
      setTextContent(null)
      setTextLoading(false)
      return
    }
    
    // If it's a code file, fetch text content
    if (isCode && !textContent && !textLoading) {
      setTextLoading(true)
      
      // Try preview URL first if available
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
            // If preview URL fails, try download API
            downloadFile(fileId)
              .then(blob => blob.text())
              .then(text => {
                setTextContent(text)
                setTextLoading(false)
              })
              .catch(() => {
                setTextLoading(false)
              })
          })
      } else {
        // No preview URL, use download API directly
        downloadFile(fileId)
          .then(blob => blob.text())
          .then(text => {
            setTextContent(text)
            setTextLoading(false)
          })
          .catch(() => {
            setTextLoading(false)
          })
      }
    }
  }, [open, fileId, previewUrl, isCode, textContent, textLoading])

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

  if (!open || !fileId) return null

  const handleDownload = async () => {
    if (!fileId) return
    try {
      const blob = await downloadFileMutation.mutateAsync(fileId)
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
      {/* Custom Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800 gap-2 flex-shrink-0 bg-white dark:bg-gray-900">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white leading-6 break-words flex-1 min-w-0 truncate">
          {displayFileName || 'File Preview'}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloadFileMutation.isPending}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{downloadFileMutation.isPending ? 'Downloading...' : 'Download'}</span>
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
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loading size="lg" />
              </div>
            )}

            {error && !isCode && (
              <div className="text-center py-12 space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    {error.message || 'Preview not available for this file type'}
                  </p>
                </div>
              </div>
            )}

            {error && isCode && (
              <>
                {textLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loading size="lg" />
                  </div>
                ) : textContent ? (
                  <div className="w-full h-full min-h-[calc(100vh-120px)] overflow-auto bg-white dark:bg-gray-900">
                    <pre className="m-0 p-6 text-sm overflow-x-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                      <code 
                        ref={codeRef} 
                        className={language ? `language-${language}` : ''}
                      >
                        {textContent}
                      </code>
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        {error.message || 'Preview not available for this file type'}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {previewUrl && !isLoading && (
              <>
                {isCode ? (
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
                ) : (
                  <div className="w-full h-full min-h-[calc(100vh-120px)] bg-white dark:bg-gray-900">
                    <FilePreview preview={previewUrl} />
                  </div>
                )}
                {previewData?.expires_in && (
                  <div className="px-6 py-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Preview expires in {Math.floor(previewData.expires_in / 60)} minutes
                    </p>
                  </div>
                )}
              </>
            )}

            {previewData && !previewData.preview_url && !isLoading && (
              <div className="text-center py-12 space-y-4 bg-white dark:bg-gray-900">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Preview not available for this file type
                </p>
              </div>
            )}
          </div>
    </Offcanvas>
  )
}

