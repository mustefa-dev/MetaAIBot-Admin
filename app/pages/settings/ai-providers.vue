<template>
  <div>
    <PageHeader :title="t('aiProviders.title')" />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UiCard v-for="provider in providers" :key="provider.name">
        <div class="p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-medium text-gray-900 dark:text-white">{{ provider.name }}</h3>
            <UiBadge :variant="provider.isAvailable ? 'success' : 'danger'" size="sm">
              {{ provider.isAvailable ? t('common.active') : t('common.inactive') }}
            </UiBadge>
          </div>

          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">{{ t('aiProviders.model') }}</span>
              <span class="text-gray-900 dark:text-white">{{ provider.model }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">{{ t('aiProviders.priority') }}</span>
              <span class="text-gray-900 dark:text-white">{{ provider.priority }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">{{ t('aiProviders.dailyLimit') }}</span>
              <span class="text-gray-900 dark:text-white">{{ provider.dailyLimit }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">{{ t('aiProviders.usedToday') }}</span>
              <span class="text-gray-900 dark:text-white">{{ provider.usedToday }}</span>
            </div>
          </div>

          <div class="mt-4">
            <div class="flex justify-between text-xs text-gray-500 mb-1">
              <span>{{ t('aiProviders.usage') }}</span>
              <span>{{ provider.usagePercentage }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all"
                :class="provider.usagePercentage > 80 ? 'bg-danger-500' : provider.usagePercentage > 50 ? 'bg-warning-500' : 'bg-success-500'"
                :style="{ width: `${provider.usagePercentage}%` }"
              />
            </div>
          </div>
        </div>
      </UiCard>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <UiSpinner class="mx-auto" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { t } = useI18n()
const api = useApi()

interface AIProvider {
  name: string
  model: string
  priority: number
  isAvailable: boolean
  dailyLimit: number | string
  usedToday: number
  remainingToday: number | string
  usagePercentage: number
}

const providers = ref<AIProvider[]>([])
const isLoading = ref(false)

async function fetchProviders() {
  isLoading.value = true
  const { data, error } = await api.get<AIProvider[]>('/admin/stats/providers')
  if (!error && data) {
    providers.value = Array.isArray(data) ? data : []
  }
  isLoading.value = false
}

onMounted(() => {
  fetchProviders()
})
</script>
