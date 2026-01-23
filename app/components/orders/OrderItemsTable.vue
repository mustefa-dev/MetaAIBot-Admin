<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="border-b border-gray-200 dark:border-gray-700">
          <th class="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ t('products.title') }}
          </th>
          <th class="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ t('orders.quantity') }}
          </th>
          <th class="text-end py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ t('products.price') }}
          </th>
          <th class="text-end py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ t('orders.total') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in items"
          :key="item.id"
          class="border-b border-gray-100 dark:border-gray-800 last:border-b-0"
        >
          <td class="py-3 px-4">
            <div class="flex items-center gap-3">
              <!-- Product Image -->
              <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shrink-0">
                <img
                  v-if="item.product?.images?.[0]?.url"
                  :src="item.product.images[0].url"
                  :alt="item.productName"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <!-- Product Info -->
              <div class="min-w-0">
                <div class="font-medium text-gray-900 dark:text-white truncate">
                  {{ item.productName }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ item.productCode }}
                </div>
                <div v-if="item.variant" class="text-xs text-gray-400 mt-0.5">
                  {{ formatVariant(item.variant) }}
                </div>
              </div>
            </div>
          </td>
          <td class="py-3 px-4 text-center text-gray-900 dark:text-white">
            {{ item.quantity }}
          </td>
          <td class="py-3 px-4 text-end text-gray-900 dark:text-white">
            {{ format.currency(item.unitPrice) }}
          </td>
          <td class="py-3 px-4 text-end font-medium text-gray-900 dark:text-white">
            {{ format.currency(item.totalPrice) }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Empty State -->
    <div v-if="items.length === 0" class="py-8 text-center text-gray-500">
      {{ t('common.noData') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderItem } from '~/types/order'

interface Props {
  items: OrderItem[]
}

defineProps<Props>()

const { t } = useI18n()
const format = useFormat()

function formatVariant(variant: Record<string, string> | undefined): string {
  if (!variant) return ''
  return Object.entries(variant)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ')
}
</script>
