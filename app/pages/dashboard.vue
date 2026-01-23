<template>
  <div>
    <PageHeader :title="t('dashboard.title')">
      <template #subtitle>
        {{ t('dashboard.welcome') }}, {{ user?.name }}
      </template>
      <template #actions>
        <UiButton variant="outline" @click="refreshAll">
          <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ t('common.refresh') }}
        </UiButton>
      </template>
    </PageHeader>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatsCard
        :title="t('dashboard.conversationsToday')"
        :value="stats?.todayConversations || 0"
        :trend="stats?.conversationsTrend"
        :trend-label="t('time.yesterday')"
        :loading="isLoading"
        icon-color="info"
      >
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </template>
      </StatsCard>

      <StatsCard
        :title="t('dashboard.ordersToday')"
        :value="stats?.todayOrders || 0"
        :trend="stats?.ordersTrend"
        :trend-label="t('time.yesterday')"
        :loading="isLoading"
        icon-color="success"
      >
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </template>
      </StatsCard>

      <StatsCard
        :title="t('dashboard.revenueToday')"
        :value="format.currency(stats?.todayRevenue || 0)"
        :trend="stats?.revenueTrend"
        :trend-label="t('time.yesterday')"
        :loading="isLoading"
        icon-color="warning"
      >
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </StatsCard>

      <StatsCard
        :title="t('dashboard.newCustomers')"
        :value="stats?.newCustomersToday || 0"
        :trend="stats?.customersTrend"
        :trend-label="t('time.yesterday')"
        :loading="isLoading"
        icon-color="purple"
      >
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </template>
      </StatsCard>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Conversations Chart -->
      <UiCard :title="t('dashboard.conversationsChart')">
        <div v-if="isLoading" class="h-64 flex items-center justify-center">
          <UiSpinner />
        </div>
        <AreaChart
          v-else
          :series="conversationsChartData.series"
          :categories="conversationsChartData.categories"
          :height="280"
        />
      </UiCard>

      <!-- Revenue Chart -->
      <UiCard :title="t('dashboard.revenueChart')">
        <div v-if="isLoading" class="h-64 flex items-center justify-center">
          <UiSpinner />
        </div>
        <BarChart
          v-else
          :series="revenueChartData.series"
          :categories="revenueChartData.categories"
          :height="280"
        />
      </UiCard>
    </div>

    <!-- Middle Row: Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <RecentConversations
        :conversations="recentConversations"
        :loading="isLoadingConversations"
      />

      <RecentOrders
        :orders="recentOrders"
        :loading="isLoadingOrders"
      />
    </div>

    <!-- Bottom Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- AI Providers Status -->
      <AIProviderStatus
        :providers="providerStats"
        :loading="isLoadingProviders"
      />

      <!-- Platform Distribution -->
      <UiCard :title="t('dashboard.platformDistribution')">
        <div v-if="isLoading" class="h-64 flex items-center justify-center">
          <UiSpinner />
        </div>
        <DonutChart
          v-else
          :series="platformChartData.series"
          :labels="platformChartData.labels"
          :colors="platformChartData.colors"
          :height="250"
          center-label="Total"
          :center-value="stats?.totalConversations || 0"
        />
      </UiCard>

      <!-- Orders by Status -->
      <UiCard :title="t('dashboard.ordersByStatus')">
        <div v-if="isLoading" class="h-64 flex items-center justify-center">
          <UiSpinner />
        </div>
        <PieChart
          v-else
          :series="orderStatusChartData.series"
          :labels="orderStatusChartData.labels"
          :colors="orderStatusChartData.colors"
          :height="250"
        />
      </UiCard>
    </div>

    <!-- System Health & Alerts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SystemHealth
        :health="systemHealth"
        :loading="isLoadingHealth"
        @refresh="fetchSystemHealth"
      />

      <LowStockAlerts
        :products="lowStockProducts"
        :loading="isLoadingLowStock"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Conversation } from '~/types/conversation'
import type { Order } from '~/types/order'
import type { Product } from '~/types/product'
import type { SystemHealth } from '~/types/stats'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { t } = useI18n()
const authStore = useAuthStore()
const statsComposable = useStats()
const format = useFormat()
const api = useApi()

const user = computed(() => authStore.user)
const stats = computed(() => statsComposable.dashboardStats.value)
const providerStats = computed(() => statsComposable.providerStats.value)
const isLoading = computed(() => statsComposable.isLoadingDashboard.value)
const isLoadingProviders = computed(() => statsComposable.isLoadingProviders.value)

// Recent data
const recentConversations = ref<Conversation[]>([])
const recentOrders = ref<Order[]>([])
const lowStockProducts = ref<Product[]>([])
const systemHealth = ref<SystemHealth | null>(null)
const isLoadingConversations = ref(false)
const isLoadingOrders = ref(false)
const isLoadingLowStock = ref(false)
const isLoadingHealth = ref(false)

// Chart data
const conversationsChartData = computed(() => {
  const chartData = stats.value?.conversationsChart || []
  return {
    series: [{
      name: t('conversations.title'),
      data: chartData.length > 0 ? chartData.map(d => d.count) : [30, 40, 35, 50, 49, 60, 70]
    }],
    categories: chartData.length > 0 ? chartData.map(d => d.date) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }
})

const revenueChartData = computed(() => {
  const chartData = stats.value?.revenueChart || []
  return {
    series: [{
      name: t('dashboard.revenueToday'),
      data: chartData.length > 0 ? chartData.map(d => d.amount) : [120000, 150000, 180000, 160000, 200000, 190000, 220000]
    }],
    categories: chartData.length > 0 ? chartData.map(d => d.date) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }
})

const platformChartData = computed(() => {
  const byPlatform = stats.value?.conversationsByPlatform || {}
  return {
    series: [byPlatform['WhatsApp'] || 0, byPlatform['Messenger'] || 0, byPlatform['Instagram'] || 0],
    labels: ['WhatsApp', 'Messenger', 'Instagram'],
    colors: ['#25D366', '#0084FF', '#E4405F']
  }
})

const orderStatusChartData = computed(() => {
  const byStatus = stats.value?.ordersByStatus || {}
  return {
    series: [
      byStatus['Pending'] || 0,
      byStatus['Processing'] || 0,
      byStatus['Shipped'] || 0,
      byStatus['Delivered'] || 0,
      byStatus['Cancelled'] || 0
    ],
    labels: [
      t('orders.statuses.pending'),
      t('orders.statuses.processing'),
      t('orders.statuses.shipped'),
      t('orders.statuses.delivered'),
      t('orders.statuses.cancelled')
    ],
    colors: ['#F59E0B', '#3B82F6', '#8B5CF6', '#22C55E', '#EF4444']
  }
})

async function fetchRecentConversations() {
  isLoadingConversations.value = true
  try {
    const { data, error } = await api.get<{ data: Conversation[] }>('/admin/conversations', {
      pageSize: 5, sortBy: 'lastMessageAt', sortOrder: 'desc'
    })
    if (!error && data) {
      recentConversations.value = data.data || []
    }
  } catch {
    recentConversations.value = []
  } finally {
    isLoadingConversations.value = false
  }
}

async function fetchRecentOrders() {
  isLoadingOrders.value = true
  try {
    const { data, error } = await api.get<{ data: Order[] }>('/orders', {
      pageSize: 5, sortBy: 'createdAt', sortOrder: 'desc'
    })
    if (!error && data) {
      recentOrders.value = data.data || []
    }
  } catch {
    recentOrders.value = []
  } finally {
    isLoadingOrders.value = false
  }
}

async function fetchLowStockProducts() {
  isLoadingLowStock.value = true
  try {
    const { data, error } = await api.get<{ data: Product[] }>('/products', {
      filter: 'lowStock', pageSize: 5
    })
    if (!error && data) {
      lowStockProducts.value = data.data || []
    }
  } catch {
    lowStockProducts.value = []
  } finally {
    isLoadingLowStock.value = false
  }
}

async function fetchSystemHealth() {
  isLoadingHealth.value = true
  try {
    const { data, error } = await api.get<SystemHealth>('/health/detailed')
    if (!error) {
      systemHealth.value = data
    }
  } catch {
    systemHealth.value = null
  } finally {
    isLoadingHealth.value = false
  }
}

async function refreshAll() {
  await Promise.all([
    statsComposable.fetchDashboardStats(),
    statsComposable.fetchProviderStats(),
    fetchRecentConversations(),
    fetchRecentOrders(),
    fetchLowStockProducts(),
    fetchSystemHealth()
  ])
}

// Fetch all data on mount
onMounted(() => {
  refreshAll()
})
</script>
