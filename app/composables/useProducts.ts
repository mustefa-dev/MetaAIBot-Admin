import type { Product, ProductStatus, ProductFilter, CreateProductRequest, UpdateProductRequest } from '~/types/product'
import { API_ENDPOINTS } from '~/utils/constants'

export function useProducts() {
  const crud = useCrud<Product>({
    endpoint: API_ENDPOINTS.PRODUCTS.BASE
  })

  const api = useApi()
  const toast = useAppToast()
  const { t } = useI18n()

  // Filters
  const filters = reactive<ProductFilter>({
    status: undefined,
    categoryId: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    lowStock: undefined
  })

  async function fetchProducts(additionalParams?: Record<string, any>) {
    return crud.fetchList({
      ...filters,
      ...additionalParams
    })
  }

  // Fetch list with pagination response
  async function fetchList(params?: ProductFilter & { page?: number; pageSize?: number }) {
    const { data, error } = await api.get<{
      data: Product[]
      total: number
      page: number
      pageSize: number
      totalPages: number
    }>(API_ENDPOINTS.PRODUCTS.BASE, params)

    if (error) {
      return { data: [], total: 0, page: 1, pageSize: 20, totalPages: 1 }
    }

    return data || { data: [], total: 0, page: 1, pageSize: 20, totalPages: 1 }
  }

  async function fetchProduct(id: string) {
    return crud.fetchOne(id)
  }

  // Fetch single product by ID
  async function fetchById(id: string): Promise<Product | null> {
    const { data, error } = await api.get<Product>(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}`)

    if (error) {
      return null
    }

    return data || null
  }

  async function createProduct(data: CreateProductRequest): Promise<Product | null> {
    const result = await crud.create(data as any)

    if (result) {
      toast.created()
    } else if (crud.error.value) {
      toast.error(crud.error.value)
    }

    return result
  }

  async function updateProduct(id: string, data: UpdateProductRequest): Promise<Product | null> {
    const result = await crud.update(id, data as any)

    if (result) {
      toast.updated()
    } else if (crud.error.value) {
      toast.error(crud.error.value)
    }

    return result
  }

  async function updateProductStatus(id: string, status: ProductStatus): Promise<boolean> {
    const { error } = await api.patch(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}/status`, { status })

    if (error) {
      toast.error(error.message)
      return false
    }

    // Update local state
    const index = crud.items.value.findIndex(p => p.id === id)
    if (index !== -1) {
      crud.items.value[index].status = status
    }
    if (crud.item.value?.id === id) {
      crud.item.value.status = status
    }

    toast.success(t('products.statusUpdated'))
    return true
  }

  async function updateStock(id: string, quantity: number): Promise<boolean> {
    const { error } = await api.patch(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}/stock`, { quantity })

    if (error) {
      toast.error(error.message)
      return false
    }

    // Update local state
    const index = crud.items.value.findIndex(p => p.id === id)
    if (index !== -1) {
      crud.items.value[index].stockQuantity = quantity
    }
    if (crud.item.value?.id === id) {
      crud.item.value.stockQuantity = quantity
    }

    toast.success(t('products.stockUpdated'))
    return true
  }

  async function deleteProduct(id: string): Promise<boolean> {
    const result = await crud.remove(id)

    if (result) {
      toast.deleted()
    } else if (crud.error.value) {
      toast.error(crud.error.value)
    }

    return result
  }

  async function bulkDeleteProducts(ids: string[]): Promise<boolean> {
    const result = await crud.bulkDelete(ids)

    if (result) {
      toast.deleted()
    } else if (crud.error.value) {
      toast.error(crud.error.value)
    }

    return result
  }

  async function uploadImage(productId: string, file: File): Promise<string | null> {
    const formData = new FormData()
    formData.append('file', file)

    const { data, error } = await api.post<{ url: string }>(
      API_ENDPOINTS.PRODUCTS.IMAGES(productId),
      formData
    )

    if (error) {
      toast.error(error.message)
      return null
    }

    return data?.url || null
  }

  async function deleteImage(productId: string, imageId: string): Promise<boolean> {
    const { error } = await api.del(`${API_ENDPOINTS.PRODUCTS.IMAGES(productId)}/${imageId}`)

    if (error) {
      toast.error(error.message)
      return false
    }

    return true
  }

  function setFilter<K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) {
    filters[key] = value
    crud.pagination.page = 1
    fetchProducts()
  }

  function clearFilters() {
    filters.status = undefined
    filters.categoryId = undefined
    filters.minPrice = undefined
    filters.maxPrice = undefined
    filters.lowStock = undefined
    crud.pagination.page = 1
    fetchProducts()
  }

  return {
    // From CRUD
    products: crud.items,
    product: crud.item,
    total: crud.total,
    isLoading: crud.isLoading,
    isSubmitting: crud.isSubmitting,
    error: crud.error,
    pagination: crud.pagination,
    setPage: crud.setPage,
    setPageSize: crud.setPageSize,
    setSort: crud.setSort,
    setSearch: crud.setSearch,

    // Product specific
    filters,

    // Actions
    fetchProducts,
    fetchProduct,
    fetchList,
    fetchById,
    createProduct,
    updateProduct,
    updateProductStatus,
    updateStock,
    deleteProduct,
    bulkDeleteProducts,
    uploadImage,
    deleteImage,
    setFilter,
    clearFilters
  }
}
