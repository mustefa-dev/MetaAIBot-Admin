import type { Customer, CustomerFilter, UpdateCustomerRequest } from '~/types/customer'
import { API_ENDPOINTS } from '~/utils/constants'

export function useCustomers() {
  const crud = useCrud<Customer>({
    endpoint: API_ENDPOINTS.CUSTOMERS.BASE
  })

  const api = useApi()
  const toast = useAppToast()
  const { t } = useI18n()

  // Filters
  const filters = reactive<CustomerFilter>({
    platform: undefined,
    hasOrders: undefined,
    isBlocked: undefined,
    search: undefined,
    startDate: undefined,
    endDate: undefined
  })

  async function fetchCustomers(additionalParams?: Record<string, any>) {
    return crud.fetchList({
      ...filters,
      ...additionalParams
    })
  }

  // Fetch list with pagination response
  async function fetchList(params?: CustomerFilter & { page?: number; pageSize?: number }) {
    const { data, error } = await api.get<{
      data: Customer[]
      total: number
      page: number
      pageSize: number
      totalPages: number
    }>(API_ENDPOINTS.CUSTOMERS.BASE, params)

    if (error) {
      return { data: [], total: 0, page: 1, pageSize: 20, totalPages: 1 }
    }

    return data || { data: [], total: 0, page: 1, pageSize: 20, totalPages: 1 }
  }

  async function fetchCustomer(id: string) {
    return crud.fetchOne(id)
  }

  // Fetch single customer by ID
  async function fetchById(id: string): Promise<Customer | null> {
    const { data, error } = await api.get<Customer>(`${API_ENDPOINTS.CUSTOMERS.BASE}/${id}`)

    if (error) {
      return null
    }

    return data || null
  }

  async function createCustomer(data: Partial<Customer>): Promise<Customer | null> {
    const result = await crud.create(data as any)

    if (result) {
      toast.created()
    } else if (crud.error.value) {
      toast.error(crud.error.value)
    }

    return result
  }

  async function updateCustomer(id: string, data: UpdateCustomerRequest): Promise<Customer | null> {
    const result = await crud.update(id, data as any)

    if (result) {
      toast.updated()
    } else if (crud.error.value) {
      toast.error(crud.error.value)
    }

    return result
  }

  async function deleteCustomer(id: string): Promise<boolean> {
    const result = await crud.remove(id)

    if (result) {
      toast.deleted()
    } else if (crud.error.value) {
      toast.error(crud.error.value)
    }

    return result
  }

  async function fetchCustomerStats(id: string) {
    const { data, error } = await api.get<{
      totalOrders: number
      totalSpent: number
      averageOrderValue: number
      lastOrderDate: string
    }>(API_ENDPOINTS.CUSTOMERS.STATS(id))

    if (error) {
      return null
    }

    return data
  }

  async function fetchCustomerOrders(id: string) {
    const { data, error } = await api.get<any[]>(API_ENDPOINTS.CUSTOMERS.ORDERS(id))

    if (error) {
      toast.error(error.message)
      return []
    }

    return data || []
  }

  async function fetchCustomerConversations(id: string) {
    const { data, error } = await api.get<any[]>(API_ENDPOINTS.CUSTOMERS.CONVERSATIONS(id))

    if (error) {
      toast.error(error.message)
      return []
    }

    return data || []
  }

  async function mergeCustomers(primaryId: string, secondaryIds: string[]): Promise<boolean> {
    const { error } = await api.post(`${API_ENDPOINTS.CUSTOMERS.BASE}/merge`, {
      primaryId,
      secondaryIds
    })

    if (error) {
      toast.error(error.message)
      return false
    }

    toast.success(t('customers.merged'))
    return true
  }

  function setFilter<K extends keyof CustomerFilter>(key: K, value: CustomerFilter[K]) {
    filters[key] = value
    crud.pagination.page = 1
    fetchCustomers()
  }

  function clearFilters() {
    filters.platform = undefined
    filters.hasOrders = undefined
    filters.isBlocked = undefined
    filters.search = undefined
    filters.startDate = undefined
    filters.endDate = undefined
    crud.pagination.page = 1
    fetchCustomers()
  }

  async function blockCustomer(id: string, isBlocked: boolean, blockReason?: string): Promise<boolean> {
    const { error } = await api.post(API_ENDPOINTS.CUSTOMERS.BLOCK(id), {
      isBlocked,
      blockReason
    })

    if (error) {
      toast.error(error.message)
      return false
    }

    toast.success(isBlocked ? t('customers.customerBlocked') : t('customers.customerUnblocked'))
    return true
  }

  return {
    // From CRUD
    customers: crud.items,
    customer: crud.item,
    total: crud.total,
    isLoading: crud.isLoading,
    isSubmitting: crud.isSubmitting,
    error: crud.error,
    pagination: crud.pagination,
    setPage: crud.setPage,
    setPageSize: crud.setPageSize,
    setSort: crud.setSort,
    setSearch: crud.setSearch,

    // Customer specific
    filters,

    // Actions
    fetchCustomers,
    fetchCustomer,
    fetchList,
    fetchById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    blockCustomer,
    fetchCustomerStats,
    fetchCustomerOrders,
    fetchCustomerConversations,
    mergeCustomers,
    setFilter,
    clearFilters
  }
}
