<template>
  <div>
    <PageHeader :title="t('customers.title')">
      <template #actions>
        <UiButton variant="outline" @click="exportCustomers">
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

    <!-- Stats -->
    <CustomersCustomerStats :stats="stats" class="mb-6" />

    <!-- Filters -->
    <UiCard class="mb-6">
      <CustomersCustomerFilters
        :filters="filters"
        @update:filters="handleFiltersUpdate"
      />
    </UiCard>

    <!-- Customer List -->
    <UiCard>
      <CustomersCustomerList
        :customers="customers"
        :loading="loading"
        @view="viewCustomer"
        @toggle-block="handleToggleBlock"
      />
    </UiCard>

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

    <!-- Block/Unblock Modal -->
    <UiModal v-model="showBlockModal" :title="blockModalTitle">
      <div class="space-y-4">
        <p class="text-gray-600 dark:text-gray-400">
          {{ blockModalMessage }}
        </p>
        <FormTextarea
          v-if="!selectedCustomer?.isBlocked"
          v-model="blockReason"
          :label="t('customers.blockReason')"
          :placeholder="t('customers.blockReasonPlaceholder')"
          :rows="3"
        />
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UiButton variant="ghost" @click="showBlockModal = false">
            {{ t('common.cancel') }}
          </UiButton>
          <UiButton
            :variant="selectedCustomer?.isBlocked ? 'primary' : 'danger'"
            :loading="blocking"
            @click="confirmToggleBlock"
          >
            {{ selectedCustomer?.isBlocked ? t('customers.unblock') : t('customers.block') }}
          </UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import type { Customer, CustomerFilter, CustomerStats } from '~/types/customer'
import { API_ENDPOINTS } from '~/utils/constants'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { t } = useI18n()
const toast = useAppToast()
const router = useRouter()
const api = useApi()
const { exportToCSV } = useExport()

// State
const loading = ref(false)
const customers = ref<Customer[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const totalItems = ref(0)
const totalPages = ref(1)
const stats = ref<CustomerStats | null>(null)
const showBlockModal = ref(false)
const selectedCustomer = ref<Customer | null>(null)
const blockReason = ref('')
const blocking = ref(false)

const filters = ref<CustomerFilter>({
  search: undefined,
  platform: undefined,
  isBlocked: undefined,
  hasOrders: undefined,
  startDate: undefined,
  endDate: undefined
})

// Computed
const blockModalTitle = computed(() => {
  return selectedCustomer.value?.isBlocked
    ? t('customers.unblockCustomer')
    : t('customers.blockCustomer')
})

const blockModalMessage = computed(() => {
  const name = selectedCustomer.value?.name || t('customers.thisCustomer')
  return selectedCustomer.value?.isBlocked
    ? t('customers.unblockConfirm', { name })
    : t('customers.blockConfirm', { name })
})

// Fetch customers
async function fetchCustomers() {
  loading.value = true
  try {
    const { data, error } = await api.get<{
      data: Customer[]
      total: number
      page: number
      pageSize: number
      totalPages: number
    }>(API_ENDPOINTS.CUSTOMERS.BASE, {
      page: currentPage.value,
      pageSize: pageSize.value,
      ...filters.value
    })

    if (error) {
      toast.error(error.message)
      return
    }

    if (data) {
      customers.value = data.data
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
  const { data } = await api.get<CustomerStats>(`${API_ENDPOINTS.CUSTOMERS.BASE}/stats`)
  if (data) {
    stats.value = data
  }
}

// Event handlers
function handleFiltersUpdate(newFilters: CustomerFilter) {
  filters.value = newFilters
  currentPage.value = 1
  fetchCustomers()
}

function handlePageChange(page: number) {
  currentPage.value = page
  fetchCustomers()
}

function viewCustomer(customer: Customer) {
  router.push(`/customers/${customer.id}`)
}

function handleToggleBlock(customer: Customer) {
  selectedCustomer.value = customer
  blockReason.value = ''
  showBlockModal.value = true
}

async function confirmToggleBlock() {
  if (!selectedCustomer.value) return

  blocking.value = true
  try {
    const { error } = await api.post(
      API_ENDPOINTS.CUSTOMERS.BLOCK(selectedCustomer.value.id),
      {
        isBlocked: !selectedCustomer.value.isBlocked,
        blockReason: blockReason.value || undefined
      }
    )

    if (error) {
      toast.error(error.message)
      return
    }

    // Update local state
    const index = customers.value.findIndex(c => c.id === selectedCustomer.value!.id)
    if (index !== -1) {
      customers.value[index].isBlocked = !selectedCustomer.value.isBlocked
      customers.value[index].blockReason = blockReason.value || undefined
    }

    toast.success(
      selectedCustomer.value.isBlocked
        ? t('customers.unblocked')
        : t('customers.blocked')
    )
    showBlockModal.value = false
    fetchStats() // Refresh stats
  } finally {
    blocking.value = false
  }
}

function refresh() {
  fetchCustomers()
  fetchStats()
}

function exportCustomers() {
  if (customers.value.length === 0) {
    toast.warning(t('common.noDataToExport'))
    return
  }

  const data = customers.value.map(customer => ({
    [t('customers.name')]: customer.name || '',
    [t('customers.phone')]: customer.phone || '',
    [t('customers.email')]: customer.email || '',
    [t('conversations.platform')]: t(`platforms.${customer.platform}`),
    [t('customers.orderCount')]: customer.orderCount,
    [t('customers.totalSpent')]: customer.totalSpent,
    [t('common.status')]: customer.isBlocked ? t('customers.blocked') : t('common.active'),
    [t('customers.lastOrder')]: customer.lastOrderAt || ''
  }))

  exportToCSV(data, `customers-${new Date().toISOString().split('T')[0]}`)
  toast.success(t('common.exportSuccess'))
}

// Initial fetch
onMounted(() => {
  fetchCustomers()
  fetchStats()
})
</script>
