import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useLogout } from '@/api/features/auth/auth.mutations'
import { AppError } from '@/api/core/error'
import { searchSuggestions } from '@/api/features/search/search.api'
import { FolderIcon, DocumentIcon } from '@heroicons/react/24/outline'
import type { ReactNode } from 'react'
import type { NavbarSearchResult } from '@/app/layout/components/Navbar/types'

export function useNavbar() {
  const navigate = useNavigate()
  const logoutMutation = useLogout()
  const [logoutError, setLogoutError] = useState<string | null>(null)

  async function handleLogout() {
    setLogoutError(null)
    try {
      await logoutMutation.mutateAsync()
      navigate({ to: '/auth/login' })
    } catch (unknownError) {
      const applicationError = unknownError as AppError
      setLogoutError(applicationError.message || 'Logout failed.')
    }
  }

  const handleSearch = async (query: string): Promise<NavbarSearchResult[]> => {
    try {
      const data = await searchSuggestions({ q: query, limit: 5 })
      return data.suggestions.map((item) => {
        const icon: ReactNode =
          item.type === 'folder' ? (
            <FolderIcon className="w-5 h-5 text-blue-500" />
          ) : (
            <DocumentIcon className="w-5 h-5 text-gray-500" />
          )
        return {
          id: item.id.toString(),
          title: item.name,
          description: item.full_path,
          url: item.type === 'folder' ? `/my-files?folderId=${item.id}` : `/my-files?fileId=${item.id}`,
          icon,
        }
      })
    } catch (error) {
      console.error('Search failed:', error)
      return []
    }
  }

  return {
    handleLogout,
    handleSearch,
    logoutError,
  }
}

