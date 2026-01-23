<template>
  <span :class="badgeClasses">
    <span v-if="dot" :class="dotClasses" />
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'gray' | 'info'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  rounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  dot: false,
  rounded: true
})

const variantClasses: Record<string, string> = {
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
  success: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
  warning: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
  danger: 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400',
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
}

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm'
}

const dotVariantClasses: Record<string, string> = {
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  gray: 'bg-gray-500',
  info: 'bg-blue-500'
}

const badgeClasses = computed(() => [
  'inline-flex items-center gap-1.5 font-medium',
  props.rounded ? 'rounded-full' : 'rounded',
  variantClasses[props.variant],
  sizeClasses[props.size]
])

const dotClasses = computed(() => [
  'w-1.5 h-1.5 rounded-full',
  dotVariantClasses[props.variant]
])
</script>
