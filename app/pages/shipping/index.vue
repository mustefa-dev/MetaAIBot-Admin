<template>
  <div>
    <PageHeader :title="t('shipping.title')" />

    <UiCard>
      <div v-if="isLoading" class="p-8 text-center">
        <UiSpinner class="mx-auto" />
      </div>

      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="gov in governorates"
          :key="gov.id"
          class="p-4 flex items-center justify-between"
        >
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">
              {{ locale === 'ar' ? gov.nameArabic || gov.name : gov.name }}
            </h3>
            <p class="text-sm text-gray-500">
              {{ t('shipping.deliveryDays') }}: {{ gov.deliveryDays }} {{ t('common.days') }}
            </p>
          </div>
          <div class="text-end">
            <p class="font-medium text-gray-900 dark:text-white">
              {{ gov.shippingCost }} {{ t('common.currency') }}
            </p>
            <UiBadge :variant="gov.isActive ? 'success' : 'gray'" size="sm">
              {{ gov.isActive ? t('common.active') : t('common.inactive') }}
            </UiBadge>
          </div>
        </div>
      </div>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { t, locale } = useI18n()
const api = useApi()

interface Governorate {
  id: number
  name: string
  nameArabic?: string
  shippingCost: number
  deliveryDays: number
  isActive: boolean
}

const governorates = ref<Governorate[]>([])
const isLoading = ref(false)

async function fetchGovernorates() {
  isLoading.value = true
  const { data, error } = await api.get<Governorate[]>('/shipping/governorates')
  if (!error && data) {
    governorates.value = Array.isArray(data) ? data : []
  }
  isLoading.value = false
}

onMounted(() => {
  fetchGovernorates()
})
</script>
