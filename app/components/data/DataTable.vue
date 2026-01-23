<template>
  <div class="overflow-hidden">
    <!-- Header with Search & Actions -->
    <div v-if="$slots.header || searchable" class="p-4 border-b border-gray-100 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <!-- Search -->
        <div v-if="searchable" class="w-full sm:w-72">
          <UiInput
            v-model="searchQuery"
            type="search"
            :placeholder="searchPlaceholder"
            clearable
          >
            <template #icon-start>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </template>
          </UiInput>
        </div>

        <!-- Header Actions Slot -->
        <div v-if="$slots.header">
          <slot name="header" />
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <!-- Selection Checkbox -->
            <th v-if="selectable" class="w-12">
              <UiCheckbox
                v-model="selectAll"
                @update:model-value="toggleSelectAll"
              />
            </th>

            <!-- Columns -->
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                column.align === 'center' ? 'text-center' : column.align === 'end' ? 'text-end' : 'text-start',
                column.width,
                { 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none': column.sortable }
              ]"
              @click="column.sortable && handleSort(column.key)"
            >
              <div class="flex items-center gap-2" :class="{ 'justify-center': column.align === 'center', 'justify-end': column.align === 'end' }">
                {{ column.label }}
                <span v-if="column.sortable && sortKey === column.key">
                  <svg v-if="sortOrder === 'asc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </th>

            <!-- Actions Column -->
            <th v-if="$slots.actions" class="w-20">
              <span class="sr-only">{{ $t('common.actions') }}</span>
            </th>
          </tr>
        </thead>

        <tbody>
          <!-- Loading State -->
          <template v-if="loading">
            <tr v-for="i in skeletonRows" :key="i">
              <td v-if="selectable"><UiSkeleton width="20px" height="20px" /></td>
              <td v-for="column in columns" :key="column.key">
                <UiSkeleton :width="column.skeletonWidth || '80%'" height="16px" />
              </td>
              <td v-if="$slots.actions"><UiSkeleton width="60px" height="32px" /></td>
            </tr>
          </template>

          <!-- Empty State -->
          <template v-else-if="filteredData.length === 0">
            <tr>
              <td :colspan="totalColumns" class="py-12">
                <slot name="empty">
                  <UiEmptyState
                    :title="emptyTitle"
                    :description="emptyDescription"
                  >
                    <template v-if="$slots['empty-action']" #action>
                      <slot name="empty-action" />
                    </template>
                  </UiEmptyState>
                </slot>
              </td>
            </tr>
          </template>

          <!-- Data Rows -->
          <template v-else>
            <tr
              v-for="(row, index) in filteredData"
              :key="rowKey ? row[rowKey] : index"
              :class="{ 'bg-primary-50 dark:bg-primary-900/10': isSelected(row) }"
            >
              <!-- Selection Checkbox -->
              <td v-if="selectable">
                <UiCheckbox
                  :model-value="isSelected(row)"
                  @update:model-value="toggleSelect(row)"
                />
              </td>

              <!-- Data Cells -->
              <td
                v-for="column in columns"
                :key="column.key"
                :class="[
                  column.align === 'center' ? 'text-center' : column.align === 'end' ? 'text-end' : 'text-start'
                ]"
              >
                <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                  {{ formatValue(row[column.key], column) }}
                </slot>
              </td>

              <!-- Actions -->
              <td v-if="$slots.actions" class="text-end">
                <slot name="actions" :row="row" :index="index" />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Footer with Pagination -->
    <div v-if="paginated && !loading && filteredData.length > 0" class="p-4 border-t border-gray-100 dark:border-gray-700">
      <UiPagination
        v-model:current-page="currentPage"
        :total-pages="totalPages"
        :total="total"
        :per-page="perPage"
        @change="$emit('page-change', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Column {
  key: string
  label: string
  sortable?: boolean
  searchable?: boolean
  align?: 'start' | 'center' | 'end'
  width?: string
  skeletonWidth?: string
  format?: (value: unknown) => string
}

interface Props {
  data: Record<string, unknown>[]
  columns: Column[]
  rowKey?: string
  loading?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  searchKeys?: string[]
  selectable?: boolean
  paginated?: boolean
  perPage?: number
  total?: number
  skeletonRows?: number
  emptyTitle?: string
  emptyDescription?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  searchable: false,
  searchPlaceholder: 'Search...',
  selectable: false,
  paginated: false,
  perPage: 10,
  total: 0,
  skeletonRows: 5,
  emptyTitle: 'No data',
  emptyDescription: 'No records found'
})

const emit = defineEmits<{
  'page-change': [page: number]
  'sort-change': [key: string, order: 'asc' | 'desc']
  'selection-change': [selected: Record<string, unknown>[]]
}>()

// Search
const searchQuery = ref('')

// Sort
const sortKey = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

// Selection
const selectedRows = ref<Record<string, unknown>[]>([])
const selectAll = ref(false)

// Pagination
const currentPage = ref(1)

// Computed
const totalColumns = computed(() => {
  let count = props.columns.length
  if (props.selectable) count++
  if (useSlots().actions) count++
  return count
})

const totalPages = computed(() => {
  return Math.ceil((props.total || props.data.length) / props.perPage)
})

const searchableKeys = computed(() => {
  if (props.searchKeys?.length) return props.searchKeys
  return props.columns.filter(c => c.searchable !== false).map(c => c.key)
})

const filteredData = computed(() => {
  let result = [...props.data]

  // Search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(row =>
      searchableKeys.value.some(key => {
        const value = row[key]
        return value != null && String(value).toLowerCase().includes(query)
      })
    )
  }

  // Sort
  if (sortKey.value) {
    const key = sortKey.value
    result.sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return result
})

// Methods
const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  emit('sort-change', key, sortOrder.value)
}

const isSelected = (row: Record<string, unknown>) => {
  return selectedRows.value.includes(row)
}

const toggleSelect = (row: Record<string, unknown>) => {
  const index = selectedRows.value.indexOf(row)
  if (index > -1) {
    selectedRows.value.splice(index, 1)
  } else {
    selectedRows.value.push(row)
  }
  selectAll.value = selectedRows.value.length === filteredData.value.length
  emit('selection-change', selectedRows.value)
}

const toggleSelectAll = (value: boolean) => {
  selectedRows.value = value ? [...filteredData.value] : []
  emit('selection-change', selectedRows.value)
}

const formatValue = (value: unknown, column: Column): string => {
  if (value == null) return '-'
  if (column.format) return column.format(value)
  return String(value)
}

// Expose for parent access
defineExpose({
  selectedRows,
  clearSelection: () => {
    selectedRows.value = []
    selectAll.value = false
  }
})
</script>
