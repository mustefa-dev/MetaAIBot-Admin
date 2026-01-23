<template>
  <UiCard :title="t('settings.notifications')">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- New Order Notification -->
      <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div>
          <div class="font-medium text-gray-900 dark:text-white">
            {{ t('settings.notifyNewOrder') }}
          </div>
          <div class="text-sm text-gray-500">
            {{ t('settings.notifyNewOrderDescription') }}
          </div>
        </div>
        <FormSwitch v-model="form.notifyOnNewOrder" />
      </div>

      <!-- Handoff Notification -->
      <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div>
          <div class="font-medium text-gray-900 dark:text-white">
            {{ t('settings.notifyHandoff') }}
          </div>
          <div class="text-sm text-gray-500">
            {{ t('settings.notifyHandoffDescription') }}
          </div>
        </div>
        <FormSwitch v-model="form.notifyOnHandoff" />
      </div>

      <!-- Low Stock Notification -->
      <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div>
          <div class="font-medium text-gray-900 dark:text-white">
            {{ t('settings.notifyLowStock') }}
          </div>
          <div class="text-sm text-gray-500">
            {{ t('settings.notifyLowStockDescription') }}
          </div>
        </div>
        <FormSwitch v-model="form.notifyOnLowStock" />
      </div>

      <!-- Notification Channels -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          v-model="form.notificationEmail"
          type="email"
          :label="t('settings.notificationEmail')"
          :placeholder="t('settings.notificationEmailPlaceholder')"
        />
        <FormInput
          v-model="form.notificationPhone"
          type="tel"
          :label="t('settings.notificationPhone')"
          :placeholder="t('settings.notificationPhonePlaceholder')"
        />
      </div>

      <!-- Low Stock Threshold -->
      <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <FormInput
          v-model.number="form.lowStockThreshold"
          type="number"
          :label="t('settings.lowStockThreshold')"
          :placeholder="t('settings.lowStockThresholdPlaceholder')"
          :min="1"
          class="max-w-xs"
        />
        <p class="text-sm text-gray-500 mt-2">
          {{ t('settings.lowStockThresholdDescription') }}
        </p>
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
  notifyOnNewOrder: true,
  notifyOnHandoff: true,
  notifyOnLowStock: true,
  notificationEmail: '',
  notificationPhone: '',
  lowStockThreshold: 10
})

watch(() => props.settings, (settings) => {
  if (settings) {
    form.notifyOnNewOrder = settings.notifyOnNewOrder ?? true
    form.notifyOnHandoff = settings.notifyOnHandoff ?? true
    form.notifyOnLowStock = settings.notifyOnLowStock ?? true
    form.notificationEmail = settings.notificationEmail || ''
    form.notificationPhone = settings.notificationPhone || ''
    form.lowStockThreshold = settings.lowStockThreshold ?? 10
  }
}, { immediate: true })

function handleSubmit() {
  emit('save', { ...form })
}
</script>
