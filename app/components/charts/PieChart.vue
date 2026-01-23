<template>
  <ClientOnly>
    <apexchart
      type="pie"
      :height="height"
      :options="chartOptions"
      :series="series"
    />
    <template #fallback>
      <div :style="{ height: `${height}px` }" class="flex items-center justify-center">
        <UiSpinner />
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
interface Props {
  series: number[]
  labels: string[]
  height?: number
  colors?: string[]
  title?: string
  showLegend?: boolean
  showLabels?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 350,
  showLegend: true,
  showLabels: true
})

const themeStore = useThemeStore()

const chartOptions = computed(() => ({
  chart: {
    type: 'pie',
    fontFamily: 'inherit',
    background: 'transparent'
  },
  colors: props.colors || ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'],
  labels: props.labels,
  dataLabels: {
    enabled: props.showLabels,
    style: {
      fontSize: '12px'
    },
    dropShadow: { enabled: false }
  },
  legend: {
    show: props.showLegend,
    position: 'bottom',
    labels: {
      colors: themeStore.isDark ? '#9ca3af' : '#6b7280'
    }
  },
  tooltip: {
    theme: themeStore.isDark ? 'dark' : 'light'
  },
  stroke: {
    show: true,
    width: 2,
    colors: [themeStore.isDark ? '#1f2937' : '#ffffff']
  },
  title: props.title ? {
    text: props.title,
    style: {
      color: themeStore.isDark ? '#ffffff' : '#111827',
      fontSize: '16px',
      fontWeight: '600'
    }
  } : undefined
}))
</script>
