import { useState, useMemo, useEffect } from 'react'
import { useListConfigs } from '@/api/features/config/config.queries'
import type { ConfigItem } from '@/api/features/config/config.types'

export type TableConfigItem = ConfigItem & {
  id: number
}

export function useConfigs() {
  const [search, setSearch] = useState<string>('')
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [perPage] = useState<number>(15)
  const [selectedConfig, setSelectedConfig] = useState<TableConfigItem | null>(null)
  const [updateConfig, setUpdateConfig] = useState<TableConfigItem | null>(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const params = useMemo(
    () => ({
      search: debouncedSearch === '' ? undefined : debouncedSearch,
      page,
      per_page: perPage,
    }),
    [debouncedSearch, page, perPage],
  )

  const { data, isLoading, error, refetch } = useListConfigs(params)

  const configs: TableConfigItem[] = useMemo(
    () => (data?.data ?? []).map(config => ({ ...config, id: config.config_id })),
    [data],
  )

  const pagination = data?.pagination

  return {
    search,
    setSearch,
    page,
    setPage,
    perPage,
    configs,
    pagination,
    isLoading,
    error,
    refetch,
    selectedConfig,
    setSelectedConfig,
    updateConfig,
    setUpdateConfig,
  }
}

