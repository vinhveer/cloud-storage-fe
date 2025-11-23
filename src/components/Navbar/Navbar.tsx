import clsx from 'clsx'
import { ArrowUpTrayIcon, MoonIcon, SunIcon, ComputerDesktopIcon, FolderIcon, DocumentIcon, PlusSmallIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/Button/Button'
import AccountDropdown from '@/components/Navbar/AccountDropdown/AccountDropdown'
import Search from '@/components/Navbar/Search/Search'
import { useTheme } from '@/app/providers/ThemeProvider'
import { useLogout } from '@/api/features/auth/auth.mutations'
import { useNavigate } from '@tanstack/react-router'
import { AppError } from '@/api/core/error'
import { useState, useRef, useEffect } from 'react'
import { useCreateFolder } from '@/api/features/folder/folder.mutations'
import UploadModal from '@/components/Upload/UploadModal'
import type { NavbarProps } from '@/components/Navbar/types'

import { searchSuggestions } from '@/api/features/search/search.api'

export default function Navbar({
  title = 'CloudStorage',
  searchPlaceholder = 'Search everything...',
  className,
  currentFolderId = null,
}: Readonly<NavbarProps>) {
  const { theme, cycleTheme } = useTheme()
  const navigate = useNavigate()
  const logoutMutation = useLogout()
  const [logoutError, setLogoutError] = useState<string | null>(null)
  const [uploadMenuOpen, setUploadMenuOpen] = useState(false)
  const [createFolderOpen, setCreateFolderOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const uploadButtonRef = useRef<HTMLDivElement | null>(null)
  const uploadMenuRef = useRef<HTMLDivElement | null>(null)

  const createFolderMutation = useCreateFolder()
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  // Outside click / escape handling for upload menu
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!uploadMenuOpen) return
      if (
        uploadMenuRef.current &&
        !uploadMenuRef.current.contains(e.target as Node) &&
        uploadButtonRef.current &&
        !uploadButtonRef.current.contains(e.target as Node)
      ) {
        setUploadMenuOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setUploadMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [uploadMenuOpen])

  async function handleLogout() {
    setLogoutError(null)
    try {
      await logoutMutation.mutateAsync()
      navigate({ to: '/auth/login' })
    } catch (unknownError) {
      const applicationError = unknownError as AppError
      setLogoutError(applicationError.message || 'Đăng xuất thất bại.')
    }
  }
  const handleSearch = async (query: string) => {
    try {
      const data = await searchSuggestions({ q: query, limit: 5 })
      return data.suggestions.map((item) => ({
        id: item.id.toString(),
        title: item.name,
        description: item.full_path,
        url: item.type === 'folder' ? `/my-files?folderId=${item.id}` : `/my-files?fileId=${item.id}`,
        icon: item.type === 'folder' ? <FolderIcon className="w-5 h-5 text-blue-500" /> : <DocumentIcon className="w-5 h-5 text-gray-500" />,
      }))
    } catch (error) {
      console.error('Search failed:', error)
      return []
    }
  }

  return (
    <nav className={clsx('sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-2', className)}>
      <div className="flex items-center justify-between">
        {/* Left: Title */}
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
        </div>

        {/* Center: Search */}
        {/* old: <Search onSearch={onSearch} placeholder={searchPlaceholder} className="flex-1 max-w-md mx-8" /> */}
        <div className="flex-1 flex justify-center">
          <Search onSearch={handleSearch} placeholder={searchPlaceholder} className="w-1/2 md:w-3/5 max-w-3xl mx-8" />
        </div>

        {/* Right: Actions & Account */}
        <div className="flex items-center space-x-3">
          {(() => {
            if (theme === 'dark') {
              return (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={cycleTheme}
                  aria-label="Toggle theme"
                  icon={<SunIcon className="w-4 h-4" />}
                />
              )
            }
            if (theme === 'light') {
              return (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={cycleTheme}
                  aria-label="Toggle theme"
                  icon={<MoonIcon className="w-4 h-4" />}
                />
              )
            }
            return (
              <Button
                variant="secondary"
                size="md"
                onClick={cycleTheme}
                aria-label="Toggle theme"
                icon={<ComputerDesktopIcon className="w-4 h-4" />}
              />
            )
          })()}
          <div className="relative" ref={uploadButtonRef}>
            <Button
              variant="primary"
              size="md"
              icon={<ArrowUpTrayIcon className="w-4 h-4" />}
              aria-label="Upload"
              onClick={() => setUploadMenuOpen(prev => !prev)}
            />
            {uploadMenuOpen && (
              <div
                ref={uploadMenuRef}
                className="absolute top-full mt-2 right-0 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-50"
              >
                <button
                  onClick={() => {
                    setUploadMenuOpen(false)
                    setCreateFolderOpen(true)
                    setNewFolderName('')
                  }}
                  className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                >
                  <PlusSmallIcon className="w-4 h-4" />
                  <span>Create folder</span>
                </button>
                <button
                  onClick={() => {
                    setUploadMenuOpen(false)
                    setUploadModalOpen(true)
                  }}
                  className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                >
                  <ArrowUpTrayIcon className="w-4 h-4" />
                  <span>Upload files</span>
                </button>
              </div>
            )}
          </div>
          <AccountDropdown onLogout={handleLogout} settingsHref="/app/account-settings" />
        </div>
      </div>
      {logoutError && (
        <p className="text-xs text-red-500 text-right mt-1" role="alert">{logoutError}</p>
      )}

      {/* Create Folder Modal */}
      {createFolderOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={() => setCreateFolderOpen(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 mx-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Create new folder</h2>
            <label className="block mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Folder name</span>
              <input
                autoFocus
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Project Docs"
              />
            </label>
            {createFolderMutation.isError && (
              <p className="text-xs text-red-500 mb-2" role="alert">{createFolderMutation.error?.message || 'Failed to create folder.'}</p>
            )}
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setCreateFolderOpen(false)}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!newFolderName.trim() || createFolderMutation.status === 'pending'}
                onClick={() => {
                  const name = newFolderName.trim()
                  if (!name) return
                  createFolderMutation.mutate(
                    { folder_name: name, parent_folder_id: currentFolderId ?? undefined },
                    {
                      onSuccess: () => {
                        setCreateFolderOpen(false)
                        setNewFolderName('')
                      },
                    },
                  )
                }}
                className={clsx(
                  'px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2',
                )}
              >
                {createFolderMutation.status === 'pending' && (
                  <span className="animate-spin h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full" />
                )}
                Create folder
              </button>
            </div>
          </div>
        </div>
      )}
      <UploadModal open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} folderId={currentFolderId} />
    </nav>
  )
}


