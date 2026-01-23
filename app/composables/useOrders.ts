import type { Order, OrderStatus, OrderFilter, OrderFilters, CreateOrderRequest, UpdateOrderRequest } from '~/types/order'
import { API_ENDPOINTS } from '~/utils/constants'

export function useOrders() {
  const crud = useCrud<Order>({
    endpoint: API_ENDPOINTS.ORDERS.BASE
  })

  const api = useApi()
  const toast = useAppToast()
  const { t } = useI18n()

  // Filters
  const filters = reactive<OrderFilters>({
    status: undefined,
    customerId: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    minTotal: undefined,
    maxTotal: undefined
  })

  async function fetchOrders(additionalParams?: Record<string, any>) {
    return crud.fetchList({
      ...filters,
      ...additionalParams
    })
  }

  // Fetch list with pagination response
  async function fetchList(params?: OrderFilter & { page?: number; pageSize?: number }) {
    const { data, error } = await api.get<{
      data: Order[]
      total: number
      page: number
      pageSize: number
      totalPages: number
    }>(API_ENDPOINTS.ORDERS.BASE, params)

    if (error) {
      return { data: [], total: 0, page: 1, pageSize: 20, totalPages: 1 }
    }

    return data || { data: [], total: 0, page: 1, pageSize: 20, totalPages: 1 }
  }

  async function fetchOrder(id: string) {
    return crud.fetchOne(id)
  }

  // Fetch single order by ID
  async function fetchById(id: string): Promise<Order | null> {
    const { data, error } = await api.get<Order>(`${API_ENDPOINTS.ORDERS.BASE}/${id}`)

    if (error) {
      return null
    }

    return data || null
  }

  async function createOrder(data: CreateOrderRequest): Promise<Order | null> {
    const result = await crud.create(data as any)

    if (result) {
      toast.created()
    } else if (crud.error.value) {
      toast.error(crud.error.value)
    }

    return result
  }

  async function updateOrder(id: string, data: UpdateOrderRequest): Promise<Order | null> {
    const result = await crud.update(id, data as any)

    if (result) {
      toast.updated()
    } else if (crud.error.value) {
      toast.error(crud.error.value)
    }

    return result
  }

  async function updateOrderStatus(id: string, status: OrderStatus, note?: string): Promise<boolean> {
    const { error } = await api.patch(`${API_ENDPOINTS.ORDERS.BASE}/${id}/status`, { status, note })

    if (error) {
      toast.error(error.message)
      return false
    }

    // Update local state
    const index = crud.items.value.findIndex(o => o.id === id)
    if (index !== -1) {
      crud.items.value[index].status = status
    }
    if (crud.item.value?.id === id) {
      crud.item.value.status = status
    }

    toast.success(t('orders.statusUpdated'))
    return true
  }

  async function cancelOrder(id: string, reason?: string): Promise<boolean> {
    const { error } = await api.post(API_ENDPOINTS.ORDERS.CANCEL(id), { reason })

    if (error) {
      toast.error(error.message)
      return false
    }

    // Update local state
    const index = crud.items.value.findIndex(o => o.id === id)
    if (index !== -1) {
      crud.items.value[index].status = 'Cancelled'
    }
    if (crud.item.value?.id === id) {
      crud.item.value.status = 'Cancelled'
    }

    toast.success(t('orders.cancelled'))
    return true
  }

  async function deleteOrder(id: string): Promise<boolean> {
    const result = await crud.remove(id)

    if (result) {
      toast.deleted()
    } else if (crud.error.value) {
      toast.error(crud.error.value)
    }

    return result
  }

  async function fetchOrderStats() {
    const { data, error } = await api.get<{
      total: number
      pending: number
      processing: number
      shipped: number
      delivered: number
      cancelled: number
      totalRevenue: number
    }>(API_ENDPOINTS.ORDERS.STATS)

    if (error) {
      return null
    }

    return data
  }

  function setFilter<K extends keyof OrderFilters>(key: K, value: OrderFilters[K]) {
    filters[key] = value
    crud.pagination.page = 1
    fetchOrders()
  }

  function clearFilters() {
    filters.status = undefined
    filters.customerId = undefined
    filters.dateFrom = undefined
    filters.dateTo = undefined
    filters.minTotal = undefined
    filters.maxTotal = undefined
    crud.pagination.page = 1
    fetchOrders()
  }

  return {
    // From CRUD
    orders: crud.items,
    order: crud.item,
    total: crud.total,
    isLoading: crud.isLoading,
    isSubmitting: crud.isSubmitting,
    error: crud.error,
    pagination: crud.pagination,
    setPage: crud.setPage,
    setPageSize: crud.setPageSize,
    setSort: crud.setSort,
    setSearch: crud.setSearch,

    // Order specific
    filters,

    // Actions
    fetchOrders,
    fetchOrder,
    fetchList,
    fetchById,
    createOrder,
    updateOrder,
    updateOrderStatus,
    updateStatus: updateOrderStatus,
    cancelOrder,
    deleteOrder,
    fetchOrderStats,
    setFilter,
    clearFilters
  }
}
