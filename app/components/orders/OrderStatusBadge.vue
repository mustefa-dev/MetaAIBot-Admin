<template>
  <UiBadge :variant="variant" :size="size">
    <span class="flex items-center gap-1.5">
      <span v-if="showIcon" class="w-1.5 h-1.5 rounded-full" :class="dotClass" />
      {{ label }}
    </span>
  </UiBadge>
</template>

<script setup lang="ts">
import type { OrderStatus } from '~/types/order'

interface Props {
  status: OrderStatus
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'sm',
  showIcon: true
})

const { t } = useI18n()

const statusConfig: Record<OrderStatus, { variant: string; dot: string }> = {
  'Pending': { variant: 'warning', dot: 'bg-yellow-500 animate-pulse' },
  'Confirmed': { variant: 'info', dot: 'bg-blue-500' },
  'Processing': { variant: 'info', dot: 'bg-blue-500 animate-pulse' },
  'Shipped': { variant: 'primary', dot: 'bg-indigo-500' },
  'Delivered': { variant: 'success', dot: 'bg-green-500' },
  'Cancelled': { variant: 'danger', dot: 'bg-red-500' },
  'Returned': { variant: 'secondary', dot: 'bg-gray-500' }
}

const config = computed(() => statusConfig[props.status] || { variant: 'secondary', dot: 'bg-gray-500' })

const variant = computed(() => config.value.variant)
const dotClass = computed(() => config.value.dot)

const label = computed(() => {
  const key = props.status.toLowerCase()
  return t(`orders.statuses.${key}`)
})
</script>
