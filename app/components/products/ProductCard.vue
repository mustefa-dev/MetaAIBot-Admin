<template>
  <div
    class="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all"
    :class="{ 'opacity-60': !product.isActive }"
  >
    <!-- Image -->
    <div class="relative aspect-square bg-gray-100 dark:bg-gray-700">
      <img
        v-if="product.imageUrl"
        :src="product.imageUrl"
        :alt="product.name"
        class="w-full h-full object-cover"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-gray-400"
      >
        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <!-- Badges -->
      <div class="absolute top-2 start-2 flex flex-col gap-1">
        <UiBadge v-if="!product.isActive" variant="gray" size="sm">
          {{ t('common.inactive') }}
        </UiBadge>
        <UiBadge v-if="hasDiscount" variant="danger" size="sm">
          -{{ discountPercent }}%
        </UiBadge>
      </div>

      <!-- Stock Badge -->
      <div class="absolute top-2 end-2">
        <StockBadge
          :quantity="product.stockQuantity"
          :threshold="product.lowStockThreshold"
          :show-quantity="false"
        />
      </div>

      <!-- Quick Actions -->
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <UiButton
          variant="white"
          size="sm"
          @click.stop="$emit('view', product)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </UiButton>
        <UiButton
          variant="white"
          size="sm"
          @click.stop="$emit('edit', product)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </UiButton>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <!-- Category -->
      <div v-if="product.category" class="text-xs text-gray-500 dark:text-gray-400 mb-1">
        {{ product.category }}
      </div>

      <!-- Name -->
      <h3 class="font-medium text-gray-900 dark:text-white line-clamp-2 mb-2">
        {{ product.name }}
      </h3>

      <!-- Code -->
      <div class="text-xs text-gray-400 font-mono mb-2">
        {{ product.code }}
      </div>

      <!-- Price -->
      <div class="flex items-center gap-2">
        <span class="text-lg font-bold text-gray-900 dark:text-white">
          {{ format.currency(product.price) }}
        </span>
        <span
          v-if="hasDiscount"
          class="text-sm text-gray-400 line-through"
        >
          {{ format.currency(product.oldPrice!) }}
        </span>
      </div>

      <!-- Stats -->
      <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-1 text-sm text-gray-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>{{ product.stockQuantity }}</span>
        </div>
        <div class="flex items-center gap-1 text-sm text-gray-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>{{ product.soldCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product, ProductListItem } from '~/types/product'

interface Props {
  product: Product | ProductListItem
}

const props = defineProps<Props>()

defineEmits<{
  view: [product: Product | ProductListItem]
  edit: [product: Product | ProductListItem]
}>()

const { t } = useI18n()
const format = useFormat()

const hasDiscount = computed(() => {
  return props.product.oldPrice && props.product.oldPrice > props.product.price
})

const discountPercent = computed(() => {
  if (!hasDiscount.value) return 0
  return Math.round((1 - props.product.price / props.product.oldPrice!) * 100)
})
</script>
