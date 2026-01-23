<template>
  <div>
    <PageHeader :title="t('products.title')">
      <template #actions>
        <UiButton variant="outline" @click="exportProducts">
          <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {{ t('common.export') }}
        </UiButton>
        <UiButton @click="navigateTo('/products/create')">
          <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ t('products.addProduct') }}
        </UiButton>
      </template>
    </PageHeader>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <UiCard class="text-center">
        <div class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ stats?.totalProducts || 0 }}
        </div>
        <div class="text-sm text-gray-500">{{ t('products.totalProducts') }}</div>
      </UiCard>
      <UiCard class="text-center">
        <div class="text-2xl font-bold text-green-600">
          {{ stats?.activeProducts || 0 }}
        </div>
        <div class="text-sm text-gray-500">{{ t('common.active') }}</div>
      </UiCard>
      <UiCard class="text-center">
        <div class="text-2xl font-bold text-amber-600">
          {{ stats?.lowStock || 0 }}
        </div>
        <div class="text-sm text-gray-500">{{ t('products.lowStock') }}</div>
      </UiCard>
      <UiCard class="text-center">
        <div class="text-2xl font-bold text-red-600">
          {{ stats?.outOfStock || 0 }}
        </div>
        <div class="text-sm text-gray-500">{{ t('products.outOfStock') }}</div>
      </UiCard>
    </div>

    <!-- Filters -->
    <UiCard class="mb-6">
      <ProductFilters
        :filters="filters"
        :categories="flatCategories"
        @update:filters="handleFiltersUpdate"
      />
    </UiCard>

    <!-- Products List -->
    <ProductList
      :products="products"
      :loading="loading"
      :total="totalItems"
      @view="viewProduct"
      @edit="editProduct"
      @create="navigateTo('/products/create')"
    />

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-6">
      <UiPagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="totalItems"
        :page-size="pageSize"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product, ProductFilter, ProductStats } from '~/types/product'
import { API_ENDPOINTS } from '~/utils/constants'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { t } = useI18n()
const toast = useAppToast()
const router = useRouter()
const productsComposable = useProducts()
const categoriesComposable = useCategories()
const { exportToCSV } = useExport()
const api = useApi()

// State
const loading = ref(false)
const products = ref<Product[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const totalItems = ref(0)
const totalPages = ref(1)
const stats = ref<ProductStats | null>(null)

const filters = ref<ProductFilter>({
  search: undefined,
  categoryId: undefined,
  status: undefined,
  lowStock: undefined,
  minPrice: undefined,
  maxPrice: undefined
})

// Flat categories for filter dropdown
const flatCategories = computed(() => {
  return categoriesComposable.getFlatCategories()
})

// Fetch products
async function fetchProducts() {
  loading.value = true
  try {
    const { data, error } = await api.get<{
      data: Product[]
      total: number
      page: number
      pageSize: number
      totalPages: number
    }>(API_ENDPOINTS.PRODUCTS.BASE, {
      page: currentPage.value,
      pageSize: pageSize.value,
      ...filters.value
    })

    if (error) {
      toast.error(error.message)
      return
    }

    if (data) {
      products.value = data.data
      totalItems.value = data.total
      totalPages.value = data.totalPages
    }
  } catch {
    toast.error(t('errors.somethingWrong'))
  } finally {
    loading.value = false
  }
}

// Fetch stats
async function fetchStats() {
  const { data } = await api.get<ProductStats>(`${API_ENDPOINTS.PRODUCTS.BASE}/stats`)
  if (data) {
    stats.value = data
  }
}

// Event handlers
function handleFiltersUpdate(newFilters: ProductFilter) {
  filters.value = newFilters
  currentPage.value = 1
  fetchProducts()
}

function handlePageChange(page: number) {
  currentPage.value = page
  fetchProducts()
}

function viewProduct(product: Product) {
  router.push(`/products/${product.id}`)
}

function editProduct(product: Product) {
  router.push(`/products/${product.id}?edit=true`)
}

function exportProducts() {
  if (products.value.length === 0) {
    toast.warning(t('common.noDataToExport'))
    return
  }

  const data = products.value.map(product => ({
    [t('products.code')]: product.code,
    [t('products.name')]: product.name,
    [t('products.nameArabic')]: product.nameArabic,
    [t('products.category')]: product.category || '',
    [t('products.price')]: product.price,
    [t('products.oldPrice')]: product.oldPrice || '',
    [t('products.stock')]: product.stockQuantity,
    [t('products.soldCount')]: product.soldCount,
    [t('common.status')]: t(`products.statuses.${product.status.toLowerCase()}`),
    [t('common.active')]: product.isActive ? t('common.yes') : t('common.no')
  }))

  exportToCSV(data, `products-${new Date().toISOString().split('T')[0]}`)
  toast.success(t('common.exportSuccess'))
}

// Initial fetch
onMounted(() => {
  fetchProducts()
  fetchStats()
  categoriesComposable.fetchCategoryTree()
})
</script>
