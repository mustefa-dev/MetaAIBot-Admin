<template>
  <div class="flex flex-col lg:flex-row gap-4">
    <!-- Search -->
    <div class="flex-1">
      <FormInput
        v-model="localFilters.search"
        :placeholder="t('common.search') + '...'"
        @update:model-value="debouncedEmit"
      >
        <template #prefix>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </template>
      </FormInput>
    </div>

    <!-- Platform Filter -->
    <FormSelect
      v-model="localFilters.platform"
      :options="platformOptions"
      :placeholder="t('conversations.platform')"
      class="w-full lg:w-40"
      @update:model-value="emitFilters"
    />

    <!-- Status Filter -->
    <FormSelect
      v-model="localFilters.status"
      :options="statusOptions"
      :placeholder="t('common.status')"
      class="w-full lg:w-44"
      @update:model-value="emitFilters"
    />

    <!-- Date Range -->
    <FormDatePicker
      v-model="dateRange"
      range
      :placeholder="t('common.filter') + ' ' + t('time.today')"
      class="w-full lg:w-56"
      @update:model-value="handleDateChange"
    />

    <!-- Clear Filters -->
    <UiButton
      v-if="hasActiveFilters"
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
</template>

<script setup lang="ts">
import type { ConversationFilter } from '~/types/conversation'

interface Props {
  filters: ConversationFilter
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:filters': [filters: ConversationFilter]
}>()

const { t } = useI18n()

const localFilters = reactive<ConversationFilter>({
  search: props.filters.search || '',
  platform: props.filters.platform || undefined,
  status: props.filters.status || undefined,
  startDate: props.filters.startDate || undefined,
  endDate: props.filters.endDate || undefined
})

const dateRange = ref<[Date, Date] | null>(
  props.filters.startDate && props.filters.endDate
    ? [new Date(props.filters.startDate), new Date(props.filters.endDate)]
    : null
)

const platformOptions = [
  { value: '', label: t('common.all') },
  { value: 'WhatsApp', label: 'WhatsApp' },
  { value: 'Messenger', label: 'Messenger' },
  { value: 'Instagram', label: 'Instagram' }
]

const statusOptions = [
  { value: '', label: t('common.all') },
  { value: 'Active', label: t('conversations.statuses.Active') },
  { value: 'PendingHandoff', label: t('conversations.statuses.PendingHandoff') },
  { value: 'Resolved', label: t('conversations.statuses.Resolved') },
  { value: 'Closed', label: t('conversations.statuses.Closed') }
]

const hasActiveFilters = computed(() => {
  return !!(
    localFilters.search ||
    localFilters.platform ||
    localFilters.status ||
    localFilters.startDate ||
    localFilters.endDate
  )
})

const debouncedEmit = useDebounceFn(() => {
  emitFilters()
}, 300)

function emitFilters() {
  emit('update:filters', {
    search: localFilters.search || undefined,
    platform: localFilters.platform || undefined,
    status: localFilters.status || undefined,
    startDate: localFilters.startDate || undefined,
    endDate: localFilters.endDate || undefined
  })
}

function handleDateChange(value: [Date, Date] | null) {
  if (value && value[0] && value[1]) {
    localFilters.startDate = value[0].toISOString()
    localFilters.endDate = value[1].toISOString()
  } else {
    localFilters.startDate = undefined
    localFilters.endDate = undefined
  }
  emitFilters()
}

function clearFilters() {
  localFilters.search = ''
  localFilters.platform = undefined
  localFilters.status = undefined
  localFilters.startDate = undefined
  localFilters.endDate = undefined
  dateRange.value = null
  emitFilters()
}

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  localFilters.search = newFilters.search || ''
  localFilters.platform = newFilters.platform
  localFilters.status = newFilters.status
  localFilters.startDate = newFilters.startDate
  localFilters.endDate = newFilters.endDate
}, { deep: true })
</script>
