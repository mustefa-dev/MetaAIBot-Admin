<template>
  <UiCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h3 class="font-semibold text-gray-900 dark:text-white">
            {{ t('dashboard.lowStockAlerts') }}
          </h3>
          <UiBadge v-if="products.length > 0" variant="danger" size="sm">
            {{ products.length }}
          </UiBadge>
        </div>
        <NuxtLink
          to="/products?filter=lowStock"
          class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          {{ t('common.view') }} {{ t('common.all') }}
        </NuxtLink>
      </div>
    </template>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 4" :key="i" class="flex items-center gap-3">
        <UiSkeleton class="w-12 h-12 rounded-lg" />
        <div class="flex-1">
          <UiSkeleton class="h-4 w-32 mb-2" />
          <UiSkeleton class="h-3 w-24" />
        </div>
      </div>
    </div>

    <div v-else-if="products.length === 0" class="text-center py-8">
      <div class="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
        <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {{ t('products.allStocked') }}
      </p>
    </div>

    <div v-else class="space-y-3">
      <NuxtLink
        v-for="product in products"
        :key="product.id"
        :to="`/products/${product.id}`"
        class="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <!-- Product Image -->
        <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shrink-0">
          <img
            v-if="product.images?.[0]?.url"
            :src="product.images[0].url"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="font-medium text-gray-900 dark:text-white truncate">
            {{ product.name }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ product.code }}
          </div>
        </div>

        <!-- Stock Info -->
        <div class="text-end shrink-0">
          <div
            class="font-semibold"
            :class="product.stockQuantity === 0 ? 'text-red-600' : 'text-yellow-600'"
          >
            {{ product.stockQuantity === 0 ? t('products.outOfStock') : product.stockQuantity + ' ' + t('products.left') }}
          </div>
          <div class="text-xs text-gray-500">
            {{ t('products.threshold') }}: {{ product.lowStockThreshold }}
          </div>
        </div>
      </NuxtLink>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

interface Props {
  products: Product[]
  loading?: boolean
}

defineProps<Props>()

const { t } = useI18n()
</script>
