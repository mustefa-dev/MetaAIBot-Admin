<template>
  <ClientOnly>
    <apexchart
      type="donut"
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
  centerLabel?: string
  centerValue?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  height: 350,
  showLegend: true,
  showLabels: true
})

const themeStore = useThemeStore()

const chartOptions = computed(() => ({
  chart: {
    type: 'donut',
    fontFamily: 'inherit',
    background: 'transparent'
  },
  colors: props.colors || ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'],
  labels: props.labels,
  dataLabels: {
    enabled: props.showLabels,
    style: {
      fontSize: '12px'
    }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: !!(props.centerLabel || props.centerValue),
          name: {
            show: !!props.centerLabel,
            fontSize: '14px',
            color: themeStore.isDark ? '#9ca3af' : '#6b7280'
          },
          value: {
            show: !!props.centerValue,
            fontSize: '24px',
            fontWeight: '600',
            color: themeStore.isDark ? '#ffffff' : '#111827',
            formatter: () => String(props.centerValue || '')
          },
          total: {
            show: !!(props.centerLabel && props.centerValue),
            label: props.centerLabel || '',
            fontSize: '14px',
            color: themeStore.isDark ? '#9ca3af' : '#6b7280',
            formatter: () => String(props.centerValue || '')
          }
        }
      }
    }
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
