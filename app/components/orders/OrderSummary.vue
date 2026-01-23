<template>
  <div class="space-y-3">
    <!-- Subtotal -->
    <div class="flex justify-between text-sm">
      <span class="text-gray-600 dark:text-gray-400">{{ t('orders.subtotal') }}</span>
      <span class="text-gray-900 dark:text-white">{{ format.currency(order.subtotal) }}</span>
    </div>

    <!-- Shipping -->
    <div class="flex justify-between text-sm">
      <span class="text-gray-600 dark:text-gray-400">{{ t('shipping.shippingCost') }}</span>
      <span class="text-gray-900 dark:text-white">
        {{ order.shippingCost === 0 ? t('shipping.freeShipping') : format.currency(order.shippingCost) }}
      </span>
    </div>

    <!-- Discount -->
    <div v-if="order.discount && order.discount > 0" class="flex justify-between text-sm">
      <span class="text-gray-600 dark:text-gray-400">{{ t('orders.discount') }}</span>
      <span class="text-green-600 dark:text-green-400">-{{ format.currency(order.discount) }}</span>
    </div>

    <!-- Divider -->
    <div class="border-t border-gray-200 dark:border-gray-700 pt-3">
      <!-- Total -->
      <div class="flex justify-between">
        <span class="font-semibold text-gray-900 dark:text-white">{{ t('orders.total') }}</span>
        <span class="text-xl font-bold text-gray-900 dark:text-white">
          {{ format.currency(order.total) }}
        </span>
      </div>
    </div>

    <!-- Payment Info -->
    <div class="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-400">{{ t('orders.paymentMethod') }}</span>
        <span class="text-gray-900 dark:text-white">
          {{ order.paymentMethod === 'CashOnDelivery' ? t('orders.cashOnDelivery') : t('orders.online') }}
        </span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-400">{{ t('orders.paymentStatus') }}</span>
        <UiBadge :variant="paymentStatusVariant" size="sm">
          {{ paymentStatusLabel }}
        </UiBadge>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types/order'

interface Props {
  order: Order
}

const props = defineProps<Props>()

const { t } = useI18n()
const format = useFormat()

const paymentStatusVariant = computed(() => {
  const variants: Record<string, string> = {
    'Pending': 'warning',
    'Paid': 'success',
    'Failed': 'danger',
    'Refunded': 'info'
  }
  return variants[props.order.paymentStatus] || 'secondary'
})

const paymentStatusLabel = computed(() => {
  const labels: Record<string, string> = {
    'Pending': t('orders.statuses.pending'),
    'Paid': t('orders.paid'),
    'Failed': t('orders.failed'),
    'Refunded': t('orders.refunded')
  }
  return labels[props.order.paymentStatus] || props.order.paymentStatus
})
</script>
