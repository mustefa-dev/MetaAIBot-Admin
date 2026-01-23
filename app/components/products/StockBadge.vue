<template>
  <UiBadge :variant="variant" :size="size">
    <svg v-if="showIcon" class="w-3 h-3 me-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        v-if="status === 'outOfStock'"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
      <path
        v-else-if="status === 'lowStock'"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
      <path
        v-else
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M5 13l4 4L19 7"
      />
    </svg>
    {{ label }}
  </UiBadge>
</template>

<script setup lang="ts">
interface Props {
  quantity: number
  threshold?: number
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  showQuantity?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  threshold: 10,
  size: 'sm',
  showIcon: true,
  showQuantity: true
})

const { t } = useI18n()

const status = computed(() => {
  if (props.quantity <= 0) return 'outOfStock'
  if (props.quantity <= props.threshold) return 'lowStock'
  return 'inStock'
})

const variant = computed(() => {
  switch (status.value) {
    case 'outOfStock':
      return 'danger'
    case 'lowStock':
      return 'warning'
    default:
      return 'success'
  }
})

const label = computed(() => {
  if (!props.showQuantity) {
    switch (status.value) {
      case 'outOfStock':
        return t('products.outOfStock')
      case 'lowStock':
        return t('products.lowStock')
      default:
        return t('products.inStock')
    }
  }

  return `${props.quantity} ${t('products.left')}`
})
</script>
