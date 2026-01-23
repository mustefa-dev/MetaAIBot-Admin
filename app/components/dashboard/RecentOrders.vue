<template>
  <UiCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-gray-900 dark:text-white">
          {{ t('dashboard.recentOrders') }}
        </h3>
        <NuxtLink
          to="/orders"
          class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          {{ t('common.view') }} {{ t('common.all') }}
        </NuxtLink>
      </div>
    </template>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="flex items-center gap-3">
        <UiSkeleton class="w-10 h-10 rounded-lg" />
        <div class="flex-1">
          <UiSkeleton class="h-4 w-24 mb-2" />
          <UiSkeleton class="h-3 w-32" />
        </div>
        <UiSkeleton class="h-6 w-16" />
      </div>
    </div>

    <div v-else-if="orders.length === 0" class="text-center py-8">
      <svg class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {{ t('common.noData') }}
      </p>
    </div>

    <div v-else class="space-y-4">
      <NuxtLink
        v-for="order in orders"
        :key="order.id"
        :to="`/orders/${order.id}`"
        class="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <!-- Order Icon -->
        <div class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-900 dark:text-white">
              #{{ order.orderNumber }}
            </span>
            <UiBadge :variant="getStatusVariant(order.status)" size="sm">
              {{ t(`orders.statuses.${order.status.toLowerCase()}`) }}
            </UiBadge>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span class="truncate">{{ order.customerName }}</span>
            <span>&bull;</span>
            <span>{{ order.items?.length || 0 }} {{ t('orders.items') }}</span>
          </div>
        </div>

        <!-- Total -->
        <div class="text-end shrink-0">
          <div class="font-semibold text-gray-900 dark:text-white">
            {{ format.currency(order.total) }}
          </div>
          <div class="text-xs text-gray-500">
            {{ format.relativeTime(order.createdAt) }}
          </div>
        </div>
      </NuxtLink>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import type { Order, OrderStatus } from '~/types/order'

interface Props {
  orders: Order[]
  loading?: boolean
}

defineProps<Props>()

const { t } = useI18n()
const format = useFormat()

function getStatusVariant(status: OrderStatus): string {
  const variants: Record<OrderStatus, string> = {
    'Pending': 'warning',
    'Confirmed': 'info',
    'Processing': 'info',
    'Shipped': 'primary',
    'Delivered': 'success',
    'Cancelled': 'danger',
    'Returned': 'secondary'
  }
  return variants[status] || 'secondary'
}
</script>
