<template>
  <div class="relative">
    <!-- Timeline Line -->
    <div class="absolute start-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

    <!-- Timeline Items -->
    <div class="space-y-6">
      <div
        v-for="(event, index) in events"
        :key="index"
        class="relative flex gap-4"
      >
        <!-- Icon -->
        <div
          class="relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          :class="getIconBgClass(event.status, index === 0)"
        >
          <component
            :is="getStatusIcon(event.status)"
            class="w-4 h-4"
            :class="index === 0 ? 'text-white' : 'text-gray-500 dark:text-gray-400'"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 pb-6">
          <div class="flex items-center justify-between">
            <span
              class="font-medium"
              :class="index === 0 ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'"
            >
              {{ getStatusLabel(event.status) }}
            </span>
            <span class="text-xs text-gray-500">
              {{ format.relativeTime(event.timestamp) }}
            </span>
          </div>
          <p v-if="event.note" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ event.note }}
          </p>
          <p v-if="event.updatedBy" class="mt-1 text-xs text-gray-400">
            {{ t('orders.updatedBy') }}: {{ event.updatedBy }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderStatus } from '~/types/order'

interface TimelineEvent {
  status: OrderStatus
  timestamp: string
  note?: string
  updatedBy?: string
}

interface Props {
  events: TimelineEvent[]
}

defineProps<Props>()

const { t } = useI18n()
const format = useFormat()

function getIconBgClass(status: OrderStatus, isLatest: boolean): string {
  if (!isLatest) {
    return 'bg-gray-100 dark:bg-gray-800'
  }

  const classes: Record<OrderStatus, string> = {
    'Pending': 'bg-yellow-500',
    'Confirmed': 'bg-blue-500',
    'Processing': 'bg-blue-500',
    'Shipped': 'bg-indigo-500',
    'Delivered': 'bg-green-500',
    'Cancelled': 'bg-red-500',
    'Returned': 'bg-gray-500'
  }
  return classes[status] || 'bg-gray-500'
}

function getStatusLabel(status: OrderStatus): string {
  return t(`orders.statuses.${status.toLowerCase()}`)
}

function getStatusIcon(status: OrderStatus) {
  return defineComponent({
    render() {
      const icons: Record<OrderStatus, any> = {
        'Pending': h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })
        ]),
        'Confirmed': h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })
        ]),
        'Processing': h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' })
        ]),
        'Shipped': h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' })
        ]),
        'Delivered': h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M5 13l4 4L19 7' })
        ]),
        'Cancelled': h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M6 18L18 6M6 6l12 12' })
        ]),
        'Returned': h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6' })
        ])
      }
      return icons[status] || icons['Pending']
    }
  })
}
</script>
