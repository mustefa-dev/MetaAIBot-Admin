<template>
  <div>
    <PageHeader :title="t('orders.title')">
      <template #actions>
        <UiButton variant="outline" @click="exportOrders">
          <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {{ t('common.export') }}
        </UiButton>
        <UiButton variant="outline" @click="refresh">
          <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ t('common.refresh') }}
        </UiButton>
      </template>
    </PageHeader>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
      <UiCard
        v-for="stat in statusStats"
        :key="stat.status"
        class="text-center cursor-pointer hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
        :class="{ 'ring-2 ring-primary-500': activeStatus === stat.status }"
        @click="setStatusFilter(stat.status)"
      >
        <div class="text-2xl font-bold" :class="stat.color">
          {{ stat.count }}
        </div>
        <div class="text-xs text-gray-500 mt-1">{{ stat.label }}</div>
      </UiCard>
    </div>

    <!-- Filters -->
    <UiCard class="mb-6">
      <OrdersOrderFilters
        :filters="filters"
        @update:filters="handleFiltersUpdate"
      />
    </UiCard>

    <!-- Orders List -->
    <OrdersOrderList
      :orders="orders"
      :loading="loading"
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
import type { Order, OrderFilter, OrderStatus } from '~/types/order'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { t } = useI18n()
const toast = useAppToast()
const ordersComposable = useOrders()
const { exportToCSV } = useExport()

// State
const loading = ref(false)
const orders = ref<Order[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const totalItems = ref(0)
const totalPages = ref(1)
const activeStatus = ref<OrderStatus | null>(null)

const filters = ref<OrderFilter>({
  search: undefined,
  status: undefined,
  paymentStatus: undefined,
  startDate: undefined,
  endDate: undefined
})

// Stats by status
const statusStats = computed(() => {
  const statuses: { status: OrderStatus | null; label: string; color: string; count: number }[] = [
    { status: null, label: t('common.all'), color: 'text-gray-900 dark:text-white', count: totalItems.value },
    { status: 'Pending', label: t('orders.statuses.pending'), color: 'text-yellow-600', count: countByStatus('Pending') },
    { status: 'Confirmed', label: t('orders.statuses.confirmed'), color: 'text-blue-600', count: countByStatus('Confirmed') },
    { status: 'Processing', label: t('orders.statuses.processing'), color: 'text-blue-600', count: countByStatus('Processing') },
    { status: 'Shipped', label: t('orders.statuses.shipped'), color: 'text-indigo-600', count: countByStatus('Shipped') },
    { status: 'Delivered', label: t('orders.statuses.delivered'), color: 'text-green-600', count: countByStatus('Delivered') },
    { status: 'Cancelled', label: t('orders.statuses.cancelled'), color: 'text-red-600', count: countByStatus('Cancelled') }
  ]
  return statuses
})

function countByStatus(status: OrderStatus): number {
  return orders.value.filter(o => o.status === status).length
}

// Fetch orders
async function fetchOrders() {
  loading.value = true
  try {
    const result = await ordersComposable.fetchList({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...filters.value
    })
    orders.value = result.data
    totalItems.value = result.total
    totalPages.value = result.totalPages
  } catch {
    toast.error(t('errors.somethingWrong'))
  } finally {
    loading.value = false
  }
}

// Event handlers
function handleFiltersUpdate(newFilters: OrderFilter) {
  filters.value = newFilters
  currentPage.value = 1
  fetchOrders()
}

function handlePageChange(page: number) {
  currentPage.value = page
  fetchOrders()
}

function setStatusFilter(status: OrderStatus | null) {
  activeStatus.value = status
  filters.value.status = status || undefined
  currentPage.value = 1
  fetchOrders()
}

function refresh() {
  fetchOrders()
}

function exportOrders() {
  if (orders.value.length === 0) {
    toast.warning(t('common.noDataToExport'))
    return
  }

  const data = orders.value.map(order => ({
    [t('orders.orderNumber')]: order.orderNumber,
    [t('customers.name')]: order.customerName,
    [t('customers.phone')]: order.phone,
    [t('common.status')]: t(`orders.statuses.${order.status.toLowerCase()}`),
    [t('orders.items')]: order.items?.length || 0,
    [t('orders.total')]: order.total,
    [t('orders.paymentMethod')]: order.paymentMethod === 'CashOnDelivery' ? t('orders.cashOnDelivery') : t('orders.online'),
    [t('shipping.governorate')]: order.governorate,
    [t('time.today')]: new Date(order.createdAt).toLocaleDateString()
  }))

  exportToCSV(data, `orders-${new Date().toISOString().split('T')[0]}`)
  toast.success(t('common.exportSuccess'))
}

// Initial fetch
onMounted(() => {
  fetchOrders()
})
</script>
