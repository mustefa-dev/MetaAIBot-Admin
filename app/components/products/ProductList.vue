<template>
  <div>
    <!-- View Toggle -->
    <div class="flex items-center justify-between mb-4">
      <div class="text-sm text-gray-500">
        {{ t('products.showing', { count: products.length, total }) }}
      </div>
      <div class="flex items-center gap-2">
        <button
          class="p-2 rounded-lg transition-colors"
          :class="viewMode === 'grid' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-400 hover:text-gray-600'"
          @click="viewMode = 'grid'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button
          class="p-2 rounded-lg transition-colors"
          :class="viewMode === 'list' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-400 hover:text-gray-600'"
          @click="viewMode = 'list'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="i in 8"
        :key="i"
        class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <UiSkeleton class="aspect-square" />
        <div class="p-4 space-y-3">
          <UiSkeleton class="h-4 w-1/3" />
          <UiSkeleton class="h-5 w-full" />
          <UiSkeleton class="h-4 w-1/4" />
          <UiSkeleton class="h-6 w-1/2" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="products.length === 0"
      class="text-center py-12"
    >
      <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        {{ t('common.noData') }}
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ t('products.noProducts') }}
      </p>
      <UiButton class="mt-4" @click="$emit('create')">
        <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ t('products.addProduct') }}
      </UiButton>
    </div>

    <!-- Grid View -->
    <div
      v-else-if="viewMode === 'grid'"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @view="$emit('view', product)"
        @edit="$emit('edit', product)"
      />
    </div>

    <!-- List View -->
    <div v-else class="space-y-3">
      <div
        v-for="product in products"
        :key="product.id"
        class="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
        :class="{ 'opacity-60': !product.isActive }"
      >
        <!-- Image -->
        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
          <img
            v-if="product.imageUrl"
            :src="product.imageUrl"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs text-gray-400 font-mono">{{ product.code }}</span>
            <UiBadge v-if="!product.isActive" variant="gray" size="sm">
              {{ t('common.inactive') }}
            </UiBadge>
          </div>
          <h3 class="font-medium text-gray-900 dark:text-white truncate">
            {{ product.name }}
          </h3>
          <div v-if="product.category" class="text-sm text-gray-500">
            {{ product.category }}
          </div>
        </div>

        <!-- Stock -->
        <div class="text-center px-4">
          <div class="text-sm text-gray-500 mb-1">{{ t('products.stock') }}</div>
          <StockBadge
            :quantity="product.stockQuantity"
            :threshold="product.lowStockThreshold || 10"
          />
        </div>

        <!-- Sold -->
        <div class="text-center px-4">
          <div class="text-sm text-gray-500 mb-1">{{ t('products.soldCount') }}</div>
          <div class="font-medium text-gray-900 dark:text-white">{{ product.soldCount }}</div>
        </div>

        <!-- Price -->
        <div class="text-end px-4">
          <div class="font-bold text-gray-900 dark:text-white">
            {{ format.currency(product.price) }}
          </div>
          <div v-if="product.oldPrice && product.oldPrice > product.price" class="text-sm text-gray-400 line-through">
            {{ format.currency(product.oldPrice) }}
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <UiButton variant="ghost" size="sm" @click="$emit('view', product)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </UiButton>
          <UiButton variant="ghost" size="sm" @click="$emit('edit', product)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product, ProductListItem } from '~/types/product'

interface Props {
  products: (Product | ProductListItem)[]
  loading?: boolean
  total?: number
}

withDefaults(defineProps<Props>(), {
  loading: false,
  total: 0
})

defineEmits<{
  view: [product: Product | ProductListItem]
  edit: [product: Product | ProductListItem]
  create: []
}>()

const { t } = useI18n()
const format = useFormat()

const viewMode = ref<'grid' | 'list'>('grid')
</script>
