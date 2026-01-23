<template>
  <UiCard :title="t('settings.currencySettings')">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Currency Code -->
        <FormSelect
          v-model="form.currency"
          :label="t('settings.currency')"
          :options="currencyOptions"
        />

        <!-- Currency Symbol -->
        <FormInput
          v-model="form.currencySymbol"
          :label="t('settings.currencySymbol')"
          :placeholder="t('settings.currencySymbolPlaceholder')"
        />

        <!-- Symbol Position -->
        <FormSelect
          v-model="form.currencyPosition"
          :label="t('settings.currencyPosition')"
          :options="positionOptions"
        />
      </div>

      <!-- Preview -->
      <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div class="text-sm text-gray-500 mb-1">{{ t('settings.currencyPreview') }}</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ previewPrice }}
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

const form = reactive({
  currency: 'IQD',
  currencySymbol: 'د.ع',
  currencyPosition: 'after' as 'before' | 'after'
})

const currencyOptions = [
  { value: 'IQD', label: 'IQD - Iraqi Dinar' },
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'SAR', label: 'SAR - Saudi Riyal' },
  { value: 'AED', label: 'AED - UAE Dirham' },
  { value: 'EGP', label: 'EGP - Egyptian Pound' }
]

const positionOptions = computed(() => [
  { value: 'before', label: t('settings.symbolBefore') },
  { value: 'after', label: t('settings.symbolAfter') }
])

const previewPrice = computed(() => {
  const amount = '25,000'
  if (form.currencyPosition === 'before') {
    return `${form.currencySymbol} ${amount}`
  }
  return `${amount} ${form.currencySymbol}`
})

watch(() => props.settings, (settings) => {
  if (settings) {
    form.currency = settings.currency || 'IQD'
    form.currencySymbol = settings.currencySymbol || 'د.ع'
    form.currencyPosition = settings.currencyPosition || 'after'
  }
}, { immediate: true })

function handleSubmit() {
  emit('save', { ...form })
}
</script>
