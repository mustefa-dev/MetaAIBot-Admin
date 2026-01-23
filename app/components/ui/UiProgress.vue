<template>
  <div>
    <!-- Label -->
    <div v-if="label || showPercentage" class="flex items-center justify-between mb-2">
      <span v-if="label" class="text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ label }}
      </span>
      <span v-if="showPercentage" class="text-sm font-medium text-gray-500 dark:text-gray-400">
        {{ Math.round(percentage) }}%
      </span>
    </div>

    <!-- Progress Bar -->
    <div :class="trackClasses">
      <div
        :class="barClasses"
        :style="{ width: `${percentage}%` }"
        role="progressbar"
        :aria-valuenow="value"
        :aria-valuemin="0"
        :aria-valuemax="max"
      >
        <span v-if="showValue" class="text-xs font-medium text-white px-2">
          {{ value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  showValue?: boolean
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  striped?: boolean
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  showPercentage: false,
  showValue: false,
  variant: 'primary',
  size: 'md',
  striped: false,
  animated: false
})

const percentage = computed(() => {
  return Math.min(Math.max((props.value / props.max) * 100, 0), 100)
})

const sizeClasses: Record<string, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4'
}

const variantClasses: Record<string, string> = {
  primary: 'bg-primary-600',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  info: 'bg-blue-500'
}

const trackClasses = computed(() => [
  'w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700',
  sizeClasses[props.size]
])

const barClasses = computed(() => [
  'h-full rounded-full transition-all duration-300 flex items-center justify-end',
  variantClasses[props.variant],
  {
    'bg-stripes': props.striped,
    'animate-stripes': props.animated
  }
])
</script>

<style scoped>
.bg-stripes {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}

.animate-stripes {
  animation: progress-stripes 1s linear infinite;
}

@keyframes progress-stripes {
  from {
    background-position: 1rem 0;
  }
  to {
    background-position: 0 0;
  }
}
</style>
