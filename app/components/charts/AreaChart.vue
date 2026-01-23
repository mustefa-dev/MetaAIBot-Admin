<template>
  <ClientOnly>
    <apexchart
      type="area"
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
  series: { name: string; data: number[] }[]
  categories: string[]
  height?: number
  colors?: string[]
  title?: string
  showLegend?: boolean
  showGrid?: boolean
  gradient?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 350,
  showLegend: true,
  showGrid: true,
  gradient: true
})

const themeStore = useThemeStore()

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: 'inherit',
    background: 'transparent'
  },
  colors: props.colors || ['#0ea5e9', '#22c55e', '#f59e0b'],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2 },
  fill: {
    type: props.gradient ? 'gradient' : 'solid',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.1,
      stops: [0, 90, 100]
    }
  },
  xaxis: {
    categories: props.categories,
    labels: {
      style: {
        colors: themeStore.isDark ? '#9ca3af' : '#6b7280',
        fontSize: '12px'
      }
    },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      style: {
        colors: themeStore.isDark ? '#9ca3af' : '#6b7280',
        fontSize: '12px'
      }
    }
  },
  grid: {
    show: props.showGrid,
    borderColor: themeStore.isDark ? '#374151' : '#e5e7eb',
    strokeDashArray: 4
  },
  legend: {
    show: props.showLegend,
    position: 'top',
    horizontalAlign: 'right',
    labels: {
      colors: themeStore.isDark ? '#9ca3af' : '#6b7280'
    }
  },
  tooltip: {
    theme: themeStore.isDark ? 'dark' : 'light',
    x: { show: true }
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
