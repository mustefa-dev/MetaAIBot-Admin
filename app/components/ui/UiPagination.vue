<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
    <!-- Info -->
    <div v-if="showInfo" class="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-start">
      {{ $t('common.showing') || 'Showing' }}
      <span class="font-medium">{{ startItem }}</span>
      -
      <span class="font-medium">{{ endItem }}</span>
      {{ $t('common.of') || 'of' }}
      <span class="font-medium">{{ total }}</span>
    </div>

    <!-- Controls -->
    <nav class="flex items-center gap-1">
      <!-- Previous -->
      <button
        type="button"
        :disabled="currentPage <= 1"
        :class="navButtonClasses"
        @click="goToPage(currentPage - 1)"
      >
        <svg class="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Pages -->
      <template v-for="page in visiblePages" :key="page">
        <span v-if="page === '...'" class="px-2 text-gray-400">...</span>
        <button
          v-else
          type="button"
          :class="[pageButtonClasses, { 'bg-primary-600 text-white hover:bg-primary-700': page === currentPage }]"
          @click="goToPage(page as number)"
        >
          {{ page }}
        </button>
      </template>

      <!-- Next -->
      <button
        type="button"
        :disabled="currentPage >= totalPages"
        :class="navButtonClasses"
        @click="goToPage(currentPage + 1)"
      >
        <svg class="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
  total: number
  perPage: number
  showInfo?: boolean
  maxVisiblePages?: number
}

const props = withDefaults(defineProps<Props>(), {
  showInfo: true,
  maxVisiblePages: 5
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
  change: [page: number]
}>()

const startItem = computed(() => {
  return (props.currentPage - 1) * props.perPage + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.perPage, props.total)
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = props.totalPages
  const current = props.currentPage
  const max = props.maxVisiblePages

  if (total <= max) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    const half = Math.floor(max / 2)
    let start = Math.max(current - half, 1)
    let end = Math.min(start + max - 1, total)

    if (end - start < max - 1) {
      start = Math.max(end - max + 1, 1)
    }

    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('...')
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < total) {
      if (end < total - 1) pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

const navButtonClasses = computed(() => [
  'p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
  'transition-colors'
])

const pageButtonClasses = computed(() => [
  'min-w-[2.5rem] h-10 px-3 rounded-lg text-sm font-medium',
  'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
  'transition-colors'
])

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('update:currentPage', page)
    emit('change', page)
  }
}
</script>
