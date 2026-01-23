<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div
        v-for="i in 5"
        :key="i"
        class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <UiSkeleton class="w-24 h-6" />
            <UiSkeleton class="w-32 h-4" />
          </div>
          <UiSkeleton class="w-20 h-6" />
        </div>
        <div class="mt-3 flex items-center justify-between">
          <UiSkeleton class="w-40 h-4" />
          <UiSkeleton class="w-24 h-5" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="orders.length === 0"
      class="text-center py-12"
    >
      <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        {{ t('common.noData') }}
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ t('orders.noOrders') }}
      </p>
    </div>

    <!-- Order Items -->
    <div v-else class="space-y-4">
      <NuxtLink
        v-for="order in orders"
        :key="order.id"
        :to="`/orders/${order.id}`"
        class="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm transition-all"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <span class="font-semibold text-gray-900 dark:text-white">
              #{{ order.orderNumber }}
            </span>
            <OrdersOrderStatusBadge :status="order.status" />
          </div>
          <span class="text-sm text-gray-500">
            {{ format.relativeTime(order.createdAt) }}
          </span>
        </div>

        <!-- Customer Info -->
        <div class="flex items-center gap-4 mb-3">
          <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{{ order.customerName }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{{ order.phone }}</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-500">
              {{ order.items?.length || 0 }} {{ t('orders.items') }}
            </span>
            <span class="text-sm text-gray-500">
              {{ order.governorate }}
            </span>
            <UiBadge
              :variant="order.paymentMethod === 'CashOnDelivery' ? 'warning' : 'success'"
              size="sm"
            >
              {{ order.paymentMethod === 'CashOnDelivery' ? t('orders.cashOnDelivery') : t('orders.online') }}
            </UiBadge>
          </div>
          <span class="text-lg font-bold text-gray-900 dark:text-white">
            {{ format.currency(order.total) }}
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types/order'

interface Props {
  orders: Order[]
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false
})

const { t } = useI18n()
const format = useFormat()
</script>
