<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <UiSkeleton class="w-20 h-5" />
        <UiSkeleton class="w-16 h-5" />
        <UiSkeleton class="flex-1 h-5" />
        <UiSkeleton class="w-24 h-5" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="orders.length === 0" class="text-center py-8 text-gray-500">
      {{ t('customers.noOrdersYet') }}
    </div>

    <!-- Orders List -->
    <div v-else class="space-y-3">
      <NuxtLink
        v-for="order in orders"
        :key="order.id"
        :to="`/orders/${order.id}`"
        class="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <!-- Order Number -->
        <div class="font-medium text-gray-900 dark:text-white">
          #{{ order.orderNumber }}
        </div>

        <!-- Status -->
        <OrdersOrderStatusBadge :status="order.status" size="sm" />

        <!-- Items Count -->
        <div class="text-sm text-gray-500">
          {{ order.items?.length || 0 }} {{ t('orders.items') }}
        </div>

        <!-- Date -->
        <div class="flex-1 text-sm text-gray-500 text-end">
          {{ format.date(order.createdAt) }}
        </div>

        <!-- Total -->
        <div class="font-bold text-gray-900 dark:text-white">
          {{ format.currency(order.total) }}
        </div>

        <!-- Arrow -->
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </NuxtLink>

      <!-- View All Link -->
      <div v-if="showViewAll && orders.length > 0" class="text-center pt-2">
        <NuxtLink
          :to="`/orders?customerId=${customerId}`"
          class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          {{ t('customers.viewAllOrders') }} &rarr;
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types/order'

interface Props {
  orders: Order[]
  customerId?: string
  loading?: boolean
  showViewAll?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
  showViewAll: true
})

const { t } = useI18n()
const format = useFormat()
</script>
