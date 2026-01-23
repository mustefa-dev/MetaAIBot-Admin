<template>
  <div class="space-y-4">
    <!-- Variants List -->
    <div v-if="variants.length > 0" class="space-y-3">
      <div
        v-for="(variant, index) in variants"
        :key="variant.id || index"
        class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
      >
        <!-- Variant Type -->
        <div class="flex-1">
          <FormSelect
            v-model="variant.variantType"
            :options="variantTypeOptions"
            :placeholder="t('products.variantType')"
            size="sm"
            @update:model-value="emitUpdate"
          />
        </div>

        <!-- Value -->
        <div class="flex-1">
          <FormInput
            v-model="variant.value"
            :placeholder="t('products.variantValue')"
            size="sm"
            @input="emitUpdate"
          />
        </div>

        <!-- Price Difference -->
        <div class="w-32">
          <FormInput
            v-model.number="variant.priceDifference"
            type="number"
            :placeholder="t('products.priceDiff')"
            size="sm"
            @input="emitUpdate"
          />
        </div>

        <!-- Stock -->
        <div class="w-24">
          <FormInput
            v-model.number="variant.stockQuantity"
            type="number"
            :placeholder="t('products.stock')"
            size="sm"
            @input="emitUpdate"
          />
        </div>

        <!-- Active Toggle -->
        <div class="flex items-center gap-2">
          <FormToggle
            v-model="variant.isActive"
            size="sm"
            @update:model-value="emitUpdate"
          />
        </div>

        <!-- Remove -->
        <button
          class="p-2 text-gray-400 hover:text-red-500 transition-colors"
          @click="removeVariant(index)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
    >
      <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
      <p class="text-gray-500 dark:text-gray-400">
        {{ t('products.noVariants') }}
      </p>
    </div>

    <!-- Add Variant Button -->
    <UiButton variant="outline" block @click="addVariant">
      <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      {{ t('products.addVariant') }}
    </UiButton>

    <!-- Variant Summary -->
    <div v-if="variants.length > 0" class="text-sm text-gray-500 dark:text-gray-400">
      {{ t('products.variantsSummary', { count: variants.length, stock: totalStock }) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductVariant } from '~/types/product'

interface Props {
  variants: ProductVariant[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:variants': [variants: ProductVariant[]]
}>()

const { t } = useI18n()

const variantTypeOptions = computed(() => [
  { value: 'Size', label: t('products.variantTypes.size') },
  { value: 'Color', label: t('products.variantTypes.color') },
  { value: 'Material', label: t('products.variantTypes.material') },
  { value: 'Style', label: t('products.variantTypes.style') },
  { value: 'Other', label: t('products.variantTypes.other') }
])

const totalStock = computed(() => {
  return props.variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0)
})

function addVariant() {
  const newVariant: ProductVariant = {
    id: `temp-${Date.now()}`,
    variantType: 'Size',
    value: '',
    priceDifference: 0,
    stockQuantity: 0,
    isActive: true
  }
  emit('update:variants', [...props.variants, newVariant])
}

function removeVariant(index: number) {
  const updated = [...props.variants]
  updated.splice(index, 1)
  emit('update:variants', updated)
}

function emitUpdate() {
  emit('update:variants', [...props.variants])
}
</script>
