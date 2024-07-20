import { useState, useEffect } from 'react'
import type { MRT_SortingState } from 'material-react-table'
import { useSearchParams } from 'react-router-dom'
import type { ColumnSort } from '@tanstack/table-core'

export function useSortingWithSearchParams() {
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [urlParams, setUrlParams] = useSearchParams({})
  const [urlParamsInitiallized, setUrlParamsInitiallized] = useState(false)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setSorting(urlParamsToColumnSort(urlParams))
    setUrlParamsInitiallized(true)
  }, [])

  useEffect(() => {
    if (urlParamsInitiallized) setUrlParams(sortingToSearchParams(sorting))
  }, [sorting, setUrlParams, urlParamsInitiallized])

  return [sorting, setSorting] as const
}

function urlParamsToColumnSort(urlParams: URLSearchParams): ColumnSort[] {
  return Array.from(urlParams.entries()).map(paramsToColumnSort)
}

function paramsToColumnSort(param: [id: string, desc: string]): ColumnSort {
  const [id, desc] = param
  return { id, desc: desc === 'desc' }
}

function sortingToSearchParams(sorting: ColumnSort[]): Record<string, string> {
  return sorting.reduce<Record<string, string>>((acc, { id, desc }) => {
    acc[id] = desc ? 'desc' : 'asc'
    return acc
  }, {})
}
