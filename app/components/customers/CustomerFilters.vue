<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Search -->
      <FormInput
        v-model="localFilters.search"
        :placeholder="t('customers.searchPlaceholder')"
        @input="debouncedEmit"
      >
        <template #prefix>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </template>
      </FormInput>

      <!-- Platform -->
      <FormSelect
        v-model="localFilters.platform"
        :options="platformOptions"
        :placeholder="t('conversations.platform')"
        @update:model-value="emitFilters"
      />

      <!-- Blocked Status -->
      <FormSelect
        v-model="localFilters.isBlocked"
        :options="blockedOptions"
        :placeholder="t('customers.blockedStatus')"
        @update:model-value="emitFilters"
      />

      <!-- Has Orders -->
      <FormSelect
        v-model="localFilters.hasOrders"
        :options="ordersOptions"
        :placeholder="t('customers.ordersFilter')"
        @update:model-value="emitFilters"
      />
    </div>

    <!-- Date Range & Clear -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2 flex-1">
        <span class="text-sm text-gray-500 whitespace-nowrap">{{ t('customers.dateRange') }}:</span>
        <FormDatePicker
          v-model="localFilters.startDate"
          :placeholder="t('common.from')"
          class="flex-1"
          @update:model-value="emitFilters"
        />
        <span class="text-gray-400">-</span>
        <FormDatePicker
          v-model="localFilters.endDate"
          :placeholder="t('common.to')"
          class="flex-1"
          @update:model-value="emitFilters"
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
import type { CustomerFilter, MessagePlatform } from '~/types/customer'

interface Props {
  filters: CustomerFilter
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:filters': [filters: CustomerFilter]
}>()

const { t } = useI18n()

const localFilters = reactive<CustomerFilter>({
  search: props.filters.search,
  platform: props.filters.platform,
  isBlocked: props.filters.isBlocked,
  hasOrders: props.filters.hasOrders,
  startDate: props.filters.startDate,
  endDate: props.filters.endDate
})

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  Object.assign(localFilters, newFilters)
}, { deep: true })

const platformOptions = computed(() => [
  { value: '', label: t('common.all') },
  { value: 'WhatsApp', label: t('platforms.WhatsApp') },
  { value: 'Messenger', label: t('platforms.Messenger') },
  { value: 'Instagram', label: t('platforms.Instagram') }
])

const blockedOptions = computed(() => [
  { value: '', label: t('common.all') },
  { value: 'false', label: t('common.active') },
  { value: 'true', label: t('customers.blocked') }
])

const ordersOptions = computed(() => [
  { value: '', label: t('common.all') },
  { value: 'true', label: t('customers.withOrders') },
  { value: 'false', label: t('customers.noOrders') }
])

const hasFilters = computed(() => {
  return localFilters.search ||
    localFilters.platform ||
    localFilters.isBlocked !== undefined ||
    localFilters.hasOrders !== undefined ||
    localFilters.startDate ||
    localFilters.endDate
})

function emitFilters() {
  emit('update:filters', { ...localFilters })
}

const debouncedEmit = useDebounceFn(emitFilters, 300)

function clearFilters() {
  localFilters.search = undefined
  localFilters.platform = undefined
  localFilters.isBlocked = undefined
  localFilters.hasOrders = undefined
  localFilters.startDate = undefined
  localFilters.endDate = undefined
  emitFilters()
}
</script>
