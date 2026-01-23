<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <UiSpinner size="lg" />
    </div>

    <!-- Not Found -->
    <div v-else-if="!order" class="flex flex-col items-center justify-center h-64">
      <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {{ t('errors.notFound') }}
      </h2>
      <UiButton @click="router.back()">
        {{ t('common.goBack') }}
      </UiButton>
    </div>

    <!-- Order Content -->
    <template v-else>
      <PageHeader :title="`${t('orders.title')} #${order.orderNumber}`">
        <template #subtitle>
          <div class="flex items-center gap-3">
            <OrdersOrderStatusBadge :status="order.status" size="md" />
            <span class="text-gray-500">
              {{ format.date(order.createdAt, 'datetime') }}
            </span>
          </div>
        </template>
        <template #actions>
          <UiButton variant="outline" @click="printInvoice">
            <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            {{ t('orders.printInvoice') }}
          </UiButton>
          <UiButton
            v-if="canCancel"
            variant="danger"
            @click="showCancelModal = true"
          >
            <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {{ t('orders.cancelOrder') }}
          </UiButton>
        </template>
      </PageHeader>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Order Items -->
          <UiCard :title="t('orders.items')">
            <OrdersOrderItemsTable :items="order.items || []" />
          </UiCard>

          <!-- Status Timeline -->
          <UiCard :title="t('orders.statusHistory')">
            <OrdersOrderTimeline :events="statusHistory" />
          </UiCard>

          <!-- Notes -->
          <UiCard v-if="order.notes" :title="t('orders.notes')">
            <p class="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {{ order.notes }}
            </p>
          </UiCard>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Order Summary -->
          <UiCard :title="t('orders.summary')">
            <OrdersOrderSummary :order="order" />
          </UiCard>

          <!-- Customer Info -->
          <UiCard :title="t('customers.title')">
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {{ initials }}
                  </span>
                </div>
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ order.customerName }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ order.phone }}
                  </div>
                </div>
              </div>

              <div v-if="order.customerId" class="pt-3 border-t border-gray-200 dark:border-gray-700">
                <NuxtLink
                  :to="`/customers/${order.customerId}`"
                  class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  {{ t('conversations.viewCustomer') }} &rarr;
                </NuxtLink>
              </div>
            </div>
          </UiCard>

          <!-- Shipping Info -->
          <UiCard :title="t('orders.shippingAddress')">
            <div class="space-y-2 text-sm">
              <div class="flex items-start gap-2">
                <svg class="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div class="text-gray-600 dark:text-gray-400">
                  {{ order.shippingAddress }}
                </div>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span class="text-gray-600 dark:text-gray-400">{{ order.governorate }}</span>
              </div>
              <div v-if="order.trackingNumber" class="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span class="text-gray-900 dark:text-white font-mono">{{ order.trackingNumber }}</span>
              </div>
            </div>
          </UiCard>

          <!-- Update Status -->
          <UiCard v-if="canUpdateStatus" :title="t('orders.updateStatus')">
            <div class="space-y-4">
              <FormSelect
                v-model="newStatus"
                :options="availableStatuses"
                :placeholder="t('common.selectOption')"
              />
              <FormTextarea
                v-model="statusNote"
                :placeholder="t('orders.notes') + ' (' + t('common.optional') + ')'"
                :rows="2"
              />
              <UiButton
                :disabled="!newStatus || updating"
                :loading="updating"
                block
                @click="updateStatus"
              >
                {{ t('orders.updateStatus') }}
              </UiButton>
            </div>
          </UiCard>
        </div>
      </div>
    </template>

    <!-- Cancel Order Modal -->
    <UiModal v-model="showCancelModal" :title="t('orders.cancelOrder')">
      <div class="space-y-4">
        <p class="text-gray-600 dark:text-gray-400">
          {{ t('messages.confirmAction', { action: t('orders.cancelOrder').toLowerCase() }) }}
        </p>
        <FormTextarea
          v-model="cancelReason"
          :label="t('orders.cancelReason')"
          :placeholder="t('orders.cancelReason') + '...'"
          :rows="3"
        />
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UiButton variant="ghost" @click="showCancelModal = false">
            {{ t('common.cancel') }}
          </UiButton>
          <UiButton
            variant="danger"
            :loading="cancelling"
            @click="cancelOrder"
          >
            {{ t('orders.cancelOrder') }}
          </UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import type { Order, OrderStatus } from '~/types/order'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const toast = useAppToast()
const format = useFormat()
const ordersComposable = useOrders()

const orderId = computed(() => route.params.id as string)

// State
const order = ref<Order | null>(null)
const loading = ref(true)
const updating = ref(false)
const cancelling = ref(false)
const showCancelModal = ref(false)
const newStatus = ref<OrderStatus | ''>('')
const statusNote = ref('')
const cancelReason = ref('')

// Computed
const initials = computed(() => {
  if (!order.value?.customerName) return '?'
  return order.value.customerName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const canCancel = computed(() => {
  if (!order.value) return false
  return ['Pending', 'Confirmed'].includes(order.value.status)
})

const canUpdateStatus = computed(() => {
  if (!order.value) return false
  return !['Cancelled', 'Returned', 'Delivered'].includes(order.value.status)
})

const availableStatuses = computed(() => {
  if (!order.value) return []

  const statusFlow: Record<OrderStatus, OrderStatus[]> = {
    'Pending': ['Confirmed', 'Cancelled'],
    'Confirmed': ['Processing', 'Cancelled'],
    'Processing': ['Shipped', 'Cancelled'],
    'Shipped': ['Delivered', 'Returned'],
    'Delivered': ['Returned'],
    'Cancelled': [],
    'Returned': []
  }

  const available = statusFlow[order.value.status] || []
  return available.map(status => ({
    value: status,
    label: t(`orders.statuses.${status.toLowerCase()}`)
  }))
})

const statusHistory = computed(() => {
  if (!order.value) return []

  // Generate timeline from order data
  const events: { status: OrderStatus; timestamp: string; note?: string }[] = [
    { status: 'Pending', timestamp: order.value.createdAt }
  ]

  if (order.value.confirmedAt) {
    events.push({ status: 'Confirmed', timestamp: order.value.confirmedAt })
  }
  if (order.value.processedAt) {
    events.push({ status: 'Processing', timestamp: order.value.processedAt })
  }
  if (order.value.shippedAt) {
    events.push({ status: 'Shipped', timestamp: order.value.shippedAt })
  }
  if (order.value.deliveredAt) {
    events.push({ status: 'Delivered', timestamp: order.value.deliveredAt })
  }
  if (order.value.cancelledAt) {
    events.push({ status: 'Cancelled', timestamp: order.value.cancelledAt, note: order.value.cancelReason })
  }

  // Sort by timestamp descending (newest first)
  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
})

// Fetch order
async function fetchOrder() {
  loading.value = true
  try {
    order.value = await ordersComposable.fetchById(orderId.value)
  } catch {
    order.value = null
  } finally {
    loading.value = false
  }
}

// Update status
async function updateStatus() {
  if (!newStatus.value || !order.value) return

  updating.value = true
  try {
    const success = await ordersComposable.updateStatus(orderId.value, newStatus.value, statusNote.value)
    if (success) {
      order.value.status = newStatus.value
      newStatus.value = ''
      statusNote.value = ''
      toast.success(t('messages.updated'))
      fetchOrder() // Refresh to get updated timestamps
    }
  } catch {
    toast.error(t('errors.somethingWrong'))
  } finally {
    updating.value = false
  }
}

// Cancel order
async function cancelOrder() {
  if (!order.value) return

  cancelling.value = true
  try {
    const success = await ordersComposable.cancelOrder(orderId.value, cancelReason.value)
    if (success) {
      order.value.status = 'Cancelled'
      order.value.cancelReason = cancelReason.value
      showCancelModal.value = false
      cancelReason.value = ''
      toast.success(t('messages.updated'))
      fetchOrder() // Refresh to get updated timestamps
    }
  } catch {
    toast.error(t('errors.somethingWrong'))
  } finally {
    cancelling.value = false
  }
}

// Print invoice
function printInvoice() {
  window.print()
}

// Initial fetch
onMounted(() => {
  fetchOrder()
})
</script>
