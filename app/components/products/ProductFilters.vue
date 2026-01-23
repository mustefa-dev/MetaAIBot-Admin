<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Search -->
      <FormInput
        v-model="localFilters.search"
        :placeholder="t('common.search') + '...'"
        @input="debouncedEmit"
      >
        <template #prefix>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </template>
      </FormInput>

      <!-- Category -->
      <FormSelect
        v-model="localFilters.categoryId"
        :options="categoryOptions"
        :placeholder="t('products.category')"
        @update:model-value="emitFilters"
      />

      <!-- Status -->
      <FormSelect
        v-model="localFilters.status"
        :options="statusOptions"
        :placeholder="t('common.status')"
        @update:model-value="emitFilters"
      />

      <!-- Stock Filter -->
      <FormSelect
        v-model="localFilters.lowStock"
        :options="stockOptions"
        :placeholder="t('products.stockFilter')"
        @update:model-value="emitFilters"
      />
    </div>

    <!-- Price Range -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2 flex-1">
        <span class="text-sm text-gray-500 whitespace-nowrap">{{ t('products.priceRange') }}:</span>
        <FormInput
          v-model.number="localFilters.minPrice"
          type="number"
          :placeholder="t('products.minPrice')"
          class="flex-1"
          @input="debouncedEmit"
        />
        <span class="text-gray-400">-</span>
        <FormInput
          v-model.number="localFilters.maxPrice"
          type="number"
          :placeholder="t('products.maxPrice')"
          class="flex-1"
          @input="debouncedEmit"
        />
      </div>

      <!-- Clear Filters -->
      <UiButton
        v-if="hasFilters"
        variant="ghost"
        size="sm"
        @click="clearFilters"
      >
        <svg class="w-4 h-4 me-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        {{ t('common.reset') }}
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductFilter, ProductStatus } from '~/types/product'

interface Props {
  filters: ProductFilter
  categories?: Array<{ id: string; name: string }>
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => []
})

const emit = defineEmits<{
  'update:filters': [filters: ProductFilter]
}>()

const { t } = useI18n()

const localFilters = reactive<ProductFilter>({
  search: props.filters.search,
  categoryId: props.filters.categoryId,
  status: props.filters.status,
  lowStock: props.filters.lowStock,
  minPrice: props.filters.minPrice,
  maxPrice: props.filters.maxPrice
})

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  Object.assign(localFilters, newFilters)
}, { deep: true })

const statusOptions = computed(() => [
  { value: '', label: t('common.all') },
  { value: 'Available', label: t('products.statuses.available') },
  { value: 'OutOfStock', label: t('products.statuses.outOfStock') },
  { value: 'Discontinued', label: t('products.statuses.discontinued') }
])

const stockOptions = computed(() => [
  { value: '', label: t('common.all') },
  { value: 'true', label: t('products.lowStock') },
  { value: 'false', label: t('products.inStock') }
])

const categoryOptions = computed(() => [
  { value: '', label: t('common.all') },
  ...props.categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }))
])

const hasFilters = computed(() => {
  return localFilters.search ||
    localFilters.categoryId ||
    localFilters.status ||
    localFilters.lowStock !== undefined ||
    localFilters.minPrice !== undefined ||
    localFilters.maxPrice !== undefined
})

function emitFilters() {
  emit('update:filters', { ...localFilters })
}

// Simple debounce implementation
let debounceTimer: ReturnType<typeof setTimeout> | null = null
function debouncedEmit() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emitFilters()
  }, 300)
}

function clearFilters() {
  localFilters.search = undefined
  localFilters.categoryId = undefined
  localFilters.status = undefined
  localFilters.lowStock = undefined
  localFilters.minPrice = undefined
  localFilters.maxPrice = undefined
  emitFilters()
}
</script>
