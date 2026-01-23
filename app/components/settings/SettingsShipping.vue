<template>
  <UiCard :title="t('settings.shippingSettings')">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Default Shipping Cost -->
        <FormInput
          v-model.number="form.defaultShippingCost"
          type="number"
          :label="t('settings.defaultShippingCost')"
          :placeholder="t('settings.defaultShippingCostPlaceholder')"
          :min="0"
        />

        <!-- Free Shipping Threshold -->
        <FormInput
          v-model.number="form.freeShippingThreshold"
          type="number"
          :label="t('settings.freeShippingThreshold')"
          :placeholder="t('settings.freeShippingThresholdPlaceholder')"
          :min="0"
          :disabled="!form.freeShippingEnabled"
        />
      </div>

      <!-- Free Shipping Enabled -->
      <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div>
          <div class="font-medium text-gray-900 dark:text-white">
            {{ t('settings.freeShippingEnabled') }}
          </div>
          <div class="text-sm text-gray-500">
            {{ t('settings.freeShippingEnabledDescription') }}
          </div>
        </div>
        <FormSwitch v-model="form.freeShippingEnabled" />
      </div>

      <!-- Info Box -->
      <div v-if="form.freeShippingEnabled && form.freeShippingThreshold" class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <div class="flex items-center gap-2 text-green-700 dark:text-green-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ t('settings.freeShippingInfo', { threshold: formatCurrency(form.freeShippingThreshold) }) }}</span>
        </div>
      </div>

      <div class="flex justify-end">
        <UiButton type="submit" :loading="saving">
          {{ t('common.save') }}
        </UiButton>
      </div>
    </form>
  </UiCard>
</template>

<script setup lang="ts">
import type { StoreSettings } from '~/types/settings'

interface Props {
  settings: StoreSettings | null
  saving?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  save: [data: Partial<StoreSettings>]
}>()

const { t } = useI18n()
const format = useFormat()

const form = reactive({
  defaultShippingCost: 5000,
  freeShippingThreshold: 50000,
  freeShippingEnabled: true
})

function formatCurrency(value: number): string {
  return format.currency(value)
}

watch(() => props.settings, (settings) => {
  if (settings) {
    form.defaultShippingCost = settings.defaultShippingCost ?? 5000
    form.freeShippingThreshold = settings.freeShippingThreshold ?? 50000
    form.freeShippingEnabled = settings.freeShippingEnabled ?? true
  }
}, { immediate: true })

function handleSubmit() {
  emit('save', { ...form })
}
</script>
