import type { PaginatedResponse, PaginationParams } from '~/types/api'

interface UseCrudOptions<T> {
  endpoint: string
  idField?: keyof T
  transform?: (item: any) => T
  transformList?: (items: any[]) => T[]
}

interface CrudState<T> {
  items: T[]
  item: T | null
  total: number
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
}

export function useCrud<T extends Record<string, any>>(options: UseCrudOptions<T>) {
  const { endpoint, idField = 'id' as keyof T, transform, transformList } = options
  const api = useApi()
  const { t } = useI18n()

  const state = reactive<CrudState<T>>({
    items: [],
    item: null,
    total: 0,
    isLoading: false,
    isSubmitting: false,
    error: null
  })

  // Pagination state
  const pagination = reactive<PaginationParams>({
    page: 1,
    pageSize: 10,
    sortBy: undefined,
    sortDesc: false,
    search: undefined
  })

  function transformItem(item: any): T {
    return transform ? transform(item) : item as T
  }

  function transformItems(items: any[]): T[] {
    if (transformList) return transformList(items)
    return items.map(transformItem)
  }

  async function fetchList(additionalParams?: Record<string, any>): Promise<boolean> {
    state.isLoading = true
    state.error = null

    const { data, error } = await api.getPaginated<T>(endpoint, pagination, additionalParams)

    if (error) {
      state.error = error.message
      state.isLoading = false
      return false
    }

    if (data) {
      state.items = transformItems(data.items)
      state.total = data.total
    }

    state.isLoading = false
    return true
  }

  async function fetchAll(params?: Record<string, any>): Promise<T[]> {
    state.isLoading = true
    state.error = null

    const { data, error } = await api.get<T[]>(endpoint, params)

    if (error) {
      state.error = error.message
      state.isLoading = false
      return []
    }

    const items = transformItems(data || [])
    state.items = items
    state.isLoading = false
    return items
  }

  async function fetchOne(id: string | number): Promise<T | null> {
    state.isLoading = true
    state.error = null

    const { data, error } = await api.get<T>(`${endpoint}/${id}`)

    if (error) {
      state.error = error.message
      state.isLoading = false
      return null
    }

    const item = data ? transformItem(data) : null
    state.item = item
    state.isLoading = false
    return item
  }

  async function create(payload: Partial<T>): Promise<T | null> {
    state.isSubmitting = true
    state.error = null

    const { data, error } = await api.post<T>(endpoint, payload)

    if (error) {
      state.error = error.message
      state.isSubmitting = false
      return null
    }

    const item = data ? transformItem(data) : null

    if (item) {
      state.items.unshift(item)
      state.total++
    }

    state.isSubmitting = false
    return item
  }

  async function update(id: string | number, payload: Partial<T>): Promise<T | null> {
    state.isSubmitting = true
    state.error = null

    const { data, error } = await api.put<T>(`${endpoint}/${id}`, payload)

    if (error) {
      state.error = error.message
      state.isSubmitting = false
      return null
    }

    const item = data ? transformItem(data) : null

    if (item) {
      const index = state.items.findIndex(i => i[idField] === id)
      if (index !== -1) {
        state.items[index] = item
      }
      if (state.item && state.item[idField] === id) {
        state.item = item
      }
    }

    state.isSubmitting = false
    return item
  }

  async function patch(id: string | number, payload: Partial<T>): Promise<T | null> {
    state.isSubmitting = true
    state.error = null

    const { data, error } = await api.patch<T>(`${endpoint}/${id}`, payload)

    if (error) {
      state.error = error.message
      state.isSubmitting = false
      return null
    }

    const item = data ? transformItem(data) : null

    if (item) {
      const index = state.items.findIndex(i => i[idField] === id)
      if (index !== -1) {
        state.items[index] = item
      }
      if (state.item && state.item[idField] === id) {
        state.item = item
      }
    }

    state.isSubmitting = false
    return item
  }

  async function remove(id: string | number): Promise<boolean> {
    state.isSubmitting = true
    state.error = null

    const { error } = await api.del(`${endpoint}/${id}`)

    if (error) {
      state.error = error.message
      state.isSubmitting = false
      return false
    }

    const index = state.items.findIndex(i => i[idField] === id)
    if (index !== -1) {
      state.items.splice(index, 1)
      state.total--
    }

    if (state.item && state.item[idField] === id) {
      state.item = null
    }

    state.isSubmitting = false
    return true
  }

  async function bulkDelete(ids: (string | number)[]): Promise<boolean> {
    state.isSubmitting = true
    state.error = null

    const { error } = await api.post(`${endpoint}/bulk-delete`, { ids })

    if (error) {
      state.error = error.message
      state.isSubmitting = false
      return false
    }

    state.items = state.items.filter(i => !ids.includes(i[idField] as string | number))
    state.total -= ids.length

    state.isSubmitting = false
    return true
  }

  // Pagination helpers
  function setPage(page: number) {
    pagination.page = page
    fetchList()
  }

  function setPageSize(size: number) {
    pagination.pageSize = size
    pagination.page = 1
    fetchList()
  }

  function setSort(field: string, desc: boolean = false) {
    pagination.sortBy = field
    pagination.sortDesc = desc
    fetchList()
  }

  function setSearch(query: string | undefined) {
    pagination.search = query
    pagination.page = 1
    fetchList()
  }

  function reset() {
    state.items = []
    state.item = null
    state.total = 0
    state.error = null
    pagination.page = 1
    pagination.search = undefined
  }

  return {
    // State
    items: computed(() => state.items),
    item: computed(() => state.item),
    total: computed(() => state.total),
    isLoading: computed(() => state.isLoading),
    isSubmitting: computed(() => state.isSubmitting),
    error: computed(() => state.error),
    pagination,

    // Actions
    fetchList,
    fetchAll,
    fetchOne,
    create,
    update,
    patch,
    remove,
    bulkDelete,

    // Pagination
    setPage,
    setPageSize,
    setSort,
    setSearch,
    reset
  }
}
