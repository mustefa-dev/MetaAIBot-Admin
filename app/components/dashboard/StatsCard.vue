<template>
  <UiCard class="relative overflow-hidden">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ title }}
        </p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
          <UiSkeleton v-if="loading" class="h-8 w-20" />
          <span v-else>{{ formattedValue }}</span>
        </p>
        <div v-if="trend !== undefined && !loading" class="flex items-center gap-1 mt-2">
          <svg
            v-if="trend !== 0"
            class="w-4 h-4"
            :class="trend > 0 ? 'text-green-500' : 'text-red-500'"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              v-if="trend > 0"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
            />
          </svg>
          <span
            class="text-sm font-medium"
            :class="trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'"
          >
            {{ trend > 0 ? '+' : '' }}{{ trend }}%
          </span>
          <span class="text-sm text-gray-500">{{ trendLabel }}</span>
        </div>
        <p v-if="subtitle && !loading" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ subtitle }}
        </p>
      </div>
      <div
        class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        :class="iconBgClass"
      >
        <slot name="icon">
          <component :is="iconComponent" v-if="icon" class="w-6 h-6" :class="iconClass" />
        </slot>
      </div>
    </div>

    <!-- Progress bar (optional) -->
    <div v-if="progress !== undefined && !loading" class="mt-4">
      <div class="flex justify-between text-xs text-gray-500 mb-1">
        <span>{{ progressLabel }}</span>
        <span>{{ progress }}%</span>
      </div>
      <UiProgress :value="progress" size="sm" :variant="progressVariant" />
    </div>

    <!-- Sparkline (optional) -->
    <div v-if="sparklineData?.length" class="mt-4 h-12">
      <svg class="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
        <polyline
          :points="sparklinePoints"
          fill="none"
          :stroke="sparklineColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: number | string
  loading?: boolean
  trend?: number
  trendLabel?: string
  subtitle?: string
  icon?: string
  iconColor?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple'
  format?: 'number' | 'currency' | 'percent' | 'none'
  progress?: number
  progressLabel?: string
  progressVariant?: 'primary' | 'success' | 'warning' | 'danger'
  sparklineData?: number[]
  sparklineColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  trendLabel: 'vs yesterday',
  iconColor: 'primary',
  format: 'number',
  progressVariant: 'primary',
  sparklineColor: '#3B82F6'
})

const { currency, number } = useFormat()

const formattedValue = computed(() => {
  if (typeof props.value === 'string') return props.value

  switch (props.format) {
    case 'currency':
      return currency(props.value)
    case 'percent':
      return `${props.value}%`
    case 'none':
      return props.value
    default:
      return number(props.value)
  }
})

const iconBgClass = computed(() => {
  const classes: Record<string, string> = {
    primary: 'bg-primary-100 dark:bg-primary-900/30',
    success: 'bg-green-100 dark:bg-green-900/30',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30',
    danger: 'bg-red-100 dark:bg-red-900/30',
    info: 'bg-blue-100 dark:bg-blue-900/30',
    purple: 'bg-purple-100 dark:bg-purple-900/30'
  }
  return classes[props.iconColor]
})

const iconClass = computed(() => {
  const classes: Record<string, string> = {
    primary: 'text-primary-600 dark:text-primary-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    danger: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400'
  }
  return classes[props.iconColor]
})

const iconComponent = computed(() => {
  // Return null for now, using slot instead
  return null
})

const sparklinePoints = computed(() => {
  if (!props.sparklineData?.length) return ''

  const data = props.sparklineData
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  return data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * 100
      const y = 30 - ((val - min) / range) * 28
      return `${x},${y}`
    })
    .join(' ')
})
</script>
